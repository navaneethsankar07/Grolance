import requests
import logging
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView
from rest_framework import status
from .models import Payment
from profiles.models import FreelancerPaymentSettings
from contracts.models import Contract
from projects.models import Project, Proposal
from .serializers import PaymentVerificationSerializer, ReleasePaymentSerializer, ClientDashboardSerializer, FreelancerTransactionSerializer, AdminTransactionSerializer
from adminpanel.permissions import IsAdminUser
from django.db.models import Sum, Count, Avg, Q
from projects.permissions import IsClientUser, IsFreelancerUser
from datetime import timedelta
from common.pagination import AdminUserPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db import transaction
from adminpanel.models import GlobalSettings


logger = logging.getLogger('payments')


class VerifyEscrowPaymentView(APIView):
    def get_paypal_token(self):
        url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        if settings.PAYPAL_MODE == 'live':
            url = "https://api-m.paypal.com/v1/oauth2/token"

        data = {"grant_type": "client_credentials"}
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        try:
            response = requests.post(url, data=data, auth=auth)
            response.raise_for_status()
            return response.json().get('access_token')
        except Exception as e:
            logger.error(f"Failed to fetch PayPal OAuth token: {str(e)}")
            return None

    def post(self, request):
        try:
            serializer = PaymentVerificationSerializer(data=request.data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)

            paypal_order_id = serializer.validated_data['paypal_order_id']
            token = self.get_paypal_token()

            if not token:
                return Response({"error": "Payment verification service unavailable"}, status=503)

            base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_MODE == 'sandbox' else "https://api-m.paypal.com"
            verify_url = f"{base_url}/v2/checkout/orders/{paypal_order_id}"
            headers = {"Authorization": f"Bearer {token}"}

            res = requests.get(verify_url, headers=headers)
            order_data = res.json()

            if order_data.get('status') != 'COMPLETED':
                logger.warning(
                    f"PayPal order {paypal_order_id} verification failed. Status: {order_data.get('status')}")
                return Response({"error": "Payment status not completed on PayPal."}, status=400)

            try:
                purchase_unit = order_data.get('purchase_units', [{}])[0]
                payments_summary = purchase_unit.get('payments', {})
                captures = payments_summary.get('captures', [{}])
                paypal_capture_id = captures[0].get('id')

                if not paypal_capture_id:
                    raise ValueError("Capture ID not found in PayPal response")
            except (IndexError, KeyError, ValueError) as e:
                logger.error(
                    f"Failed to extract Capture ID for order {paypal_order_id}: {str(e)}")
                return Response({"error": "Could not retrieve transaction details from PayPal."}, status=400)

            project_id = serializer.validated_data['project_id']
            freelancer_profile_id = serializer.validated_data['freelancer_id']
            total_amount = float(serializer.validated_data['total_amount'])

            project = get_object_or_404(Project, id=project_id)
            from profiles.models import FreelancerProfile
            freelancer_profile = get_object_or_404(
                FreelancerProfile, id=freelancer_profile_id)
            freelancer_user = freelancer_profile.user

            proposal = Proposal.objects.filter(
                project=project, freelancer=freelancer_profile).first()
            selected_package = None

            if proposal:
                selected_package = proposal.package
            else:
                from projects.models import Invitation
                invitation = Invitation.objects.filter(
                    project=project, freelancer=freelancer_profile, status='accepted').first()
                if invitation:
                    selected_package = invitation.package

            client_sig = request.data.get('client_signature')
            client_sig_type = request.data.get('client_signature_type', 'type')

            contract = Contract.objects.create(
                project=project,
                client=request.user,
                freelancer=freelancer_user,
                total_amount=total_amount,
                client_ip=request.META.get('REMOTE_ADDR'),
                client_signed_at=timezone.now(),
                client_signature=client_sig,
                client_signature_type=client_sig_type,
                is_funded=True,
                status='offered',
                package=selected_package
            )

            settings_obj = GlobalSettings.objects.filter(pk=1).first()
            fee_percent = float(settings_obj.commission_percentage) / 100 if settings_obj else 0.10
            platform_fee = total_amount * fee_percent
            freelancer_share = total_amount - platform_fee

            Payment.objects.create(
                contract=contract,
                paypal_order_id=paypal_order_id,
                paypal_capture_id=paypal_capture_id,
                amount_total=total_amount,
                platform_fee=platform_fee,
                freelancer_share=freelancer_share,
                status='escrow'
            )

            project.status = 'in_progress'
            project.save()

            if not proposal:
                from projects.models import Invitation
                Invitation.objects.filter(
                    project=project, freelancer=freelancer_profile, status='accepted').update(status='hired')

                logger.info(
                    f"Escrow secured. Capture ID: {paypal_capture_id}. Contract: {contract.id}")
            return Response({"message": "Escrow secured via PayPal.", "contract_id": contract.id}, status=201)
        except Exception as e:
            logger.error(f"Error in VerifyEscrowPaymentView: {str(e)}")
            return Response({"error": "An unexpected error occurred during payment verification."}, status=500)


class ReleasePaymentView(APIView):
    permission_classes = [IsAdminUser]

    def get_paypal_token(self):
        url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        if getattr(settings, 'PAYPAL_MODE', 'sandbox') == 'live':
            url = "https://api-m.paypal.com/v1/oauth2/token"

        data = {"grant_type": "client_credentials"}
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        try:
            response = requests.post(url, data=data, auth=auth)
            response.raise_for_status()
            return response.json().get('access_token')
        except Exception as e:
            logger.error(f"Failed to fetch PayPal Payout token: {str(e)}")
            return None

    def post(self, request):
        try:
            serializer = ReleasePaymentSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)

            contract_id = serializer.validated_data['contract_id']
            global_settings = GlobalSettings.objects.filter(pk=1).first()
            if not global_settings or not global_settings.paypal_email:
                return Response({
                    "error": "Platform PayPal email is not configured in Global Settings."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            platform_email = global_settings.paypal_email

            contract = get_object_or_404(Contract, id=contract_id)
            payment_record = get_object_or_404(Payment, contract=contract)

            freelancer_payment_info = get_object_or_404(
                FreelancerPaymentSettings, user=contract.freelancer)
            freelancer_email = freelancer_payment_info.paypal_email

            token = self.get_paypal_token()
            if not token:
                return Response({"error": "Payout service unavailable"}, status=503)

            base_url = "https://api-m.sandbox.paypal.com" if getattr(
                settings, 'PAYPAL_MODE', 'sandbox') == 'sandbox' else "https://api-m.paypal.com"
            payout_url = f"{base_url}/v1/payments/payouts"

            headers = {
                "Content-Type": "application/json",
                "Authorization": f"Bearer {token}"
            }

            batch_id = f"payout_{contract.id}_{int(timezone.now().timestamp())}"

            payload = {
                "sender_batch_header": {
                    "sender_batch_id": batch_id,
                    "email_subject": "You have a payout from Grolance!",
                    "email_message": "Funds for your completed project have been released."
                },
                "items": [
                    {
                        "recipient_type": "EMAIL",
                        "amount": {
                            "value": "{:.2f}".format(float(payment_record.freelancer_share)),
                            "currency": "USD"
                        },
                        "receiver": freelancer_email,
                        "note": f"Payment for contract #{contract.id}",
                        "sender_item_id": f"item_f_{contract.id}"
                    },
                    {
                        "recipient_type": "EMAIL",
                        "amount": {
                            "value": "{:.2f}".format(float(payment_record.platform_fee)),
                            "currency": "USD"
                        },
                        "receiver": platform_email,
                        "note": f"Platform fee for contract #{contract.id}",
                        "sender_item_id": f"item_p_{contract.id}"
                    }
                ]
            }

            response = requests.post(payout_url, json=payload, headers=headers)
            res_data = response.json()

            if response.status_code in [201, 200]:
                payment_record.status = 'released'
                payment_record.save()
                contract.status = 'completed'
                contract.paid_to_freelancer = True
                contract.save()
                project = contract.project
                project.status = 'completed'
                project.is_active = False
                project.save()
                logger.info(
                    f"Payout successful for Contract {contract.id}. Batch ID: {batch_id}. Admin: {request.user.id}")
                return Response({"message": "Payout initiated successfully."}, status=200)

            logger.error(
                f"PayPal Payout Failed for Contract {contract.id}. Status: {response.status_code}. Response: {res_data}")
            return Response({
                "error": "PayPal Payout Failed",
                "details": res_data
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.critical(
                f"Critical error during payout release for Contract {contract.id}: {str(e)}")
            return Response({"error": "Internal server error during payout processing"}, status=500)


class RefundPaymentView(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request):
        try:
            raw_payment_id = request.data.get('payment_id')
            if isinstance(raw_payment_id, str) and raw_payment_id.startswith('PAY-'):
                payment_id = raw_payment_id.replace('PAY-', '')
            else:
                payment_id = raw_payment_id

            with transaction.atomic():
                payment = Payment.objects.select_for_update().get(id=payment_id)
                contract = payment.contract
                dispute = contract.disputes.first()

                if contract.status != 'completed' and contract.status != 'disputed':
                     pass 

                is_client_won = dispute and dispute.opened_by_client and dispute.status == 'resolved'
                is_freelancer_lost = dispute and dispute.opened_by_freelancer and dispute.status == 'rejected'

                if not (is_client_won or is_freelancer_lost):
                    return Response(
                        {"error": "Refund not authorized for this dispute outcome."},
                        status=status.HTTP_403_FORBIDDEN
                    )

                if payment.status in ['released', 'refunded']:
                    return Response(
                        {"error": f"Payment is already {payment.status}."},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                if not payment.paypal_capture_id:
                    return Response({"error": "Capture ID missing"}, status=400)

                token = VerifyEscrowPaymentView().get_paypal_token()
                if not token:
                    return Response({"error": "Payment service unavailable"}, status=503)

                base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_MODE == 'sandbox' else "https://api-m.paypal.com"

                refund_amount = str(payment.freelancer_share)

                res = requests.post(
                    f"{base_url}/v2/payments/captures/{payment.paypal_capture_id}/refund",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Content-Type": "application/json",
                        "PayPal-Request-Id": f"refund-{payment.paypal_capture_id}" 
                    },
                    json={
                        "amount": {
                            "value": refund_amount,
                            "currency_code": "USD"
                        },
                        "note_to_payer": "Refund issued after platform fee deduction."
                    }
                )

                response_data = res.json()

                if res.status_code in [200, 201]:
                    payment.status = 'refunded'
                    payment.save()
                    
                    contract.status = 'refunded'
                    contract.is_funded = False 
                    contract.save()
                    
                    return Response({"message": "Refund processed successfully"})
                
                if response_data.get('name') == 'ALREADY_REFUNDED':
                    payment.status = 'refunded'
                    payment.save()
                    return Response({"message": "Payment was already refunded."})

                return Response(response_data, status=res.status_code)

        except Payment.DoesNotExist:
            return Response({"error": "Payment not found"}, status=404)
        except Exception as e:
            logger.error(f"Error in RefundPaymentView: {str(e)}")
            return Response({"error": "Internal server error during refund processing"}, status=500)


class ClientSpendingSummaryView(APIView):
    permission_classes = [IsClientUser]

    def get(self, request):
        try:
            user_contracts = Contract.objects.filter(client=request.user)

            stats = user_contracts.aggregate(
                total_spent=Sum('total_amount'),
                projects_completed=Count('id', filter=Q(status='completed')),
                ongoing_projects=Count('id', filter=Q(status='active')),
                avg_per_project=Avg('total_amount', filter=Q())
            )

            recent_contracts = user_contracts.order_by('-client_signed_at')[:5]

            data = {
                'total_spent': stats['total_spent'] or 0,
                'projects_completed': stats['projects_completed'] or 0,
                'ongoing_projects': stats['ongoing_projects'] or 0,
                'avg_per_project': stats['avg_per_project'] or 0,
                'recent_projects': recent_contracts
            }
            serializer = ClientDashboardSerializer(data)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in ClientSpendingSummaryView: {str(e)}")
            return Response({"error": "Could not retrieve spending summary."}, status=500)


class FreelancerTransactionView(APIView):
    permission_classes = [IsFreelancerUser]

    def get(self, request):
        try:
            queryset = Contract.objects.filter(
                freelancer=request.user).order_by('-client_signed_at')
            status_filter = request.query_params.get('status')

            if status_filter:
                queryset = queryset.filter(status=status_filter)

            time_range = request.query_params.get('range')
            if time_range:
                now = timezone.now()
                if time_range == '1m':
                    queryset = queryset.filter(
                        client_signed_at__gte=now - timedelta(days=30))
                elif time_range == '6m':
                    queryset = queryset.filter(
                        client_signed_at__gte=now - timedelta(days=180))
                elif time_range == '1y':
                    queryset = queryset.filter(
                        client_signed_at__gte=now - timedelta(days=365))

            stats = queryset.aggregate(
                total_earning=Sum('escrow_details__freelancer_share'),
                total_projects=Count('id')
            )
            paginator = AdminUserPagination()
            page = paginator.paginate_queryset(queryset, request)

            serializer = FreelancerTransactionSerializer({
                'total_earning': stats['total_earning'] or 0,
                'total_projects': stats['total_projects'] or 0,
                'contracts': page
            })
            return paginator.get_paginated_response(serializer.data)
        except Exception as e:
            logger.error(f"Error in FreelancerTransactionView: {str(e)}")
            return Response({"error": "Could not retrieve transaction history."}, status=500)


class AdminTransactionListView(ListAPIView):
    queryset = Payment.objects.select_related(
        'contract__client', 'contract__freelancer').order_by('-created_at')
    serializer_class = AdminTransactionSerializer
    permission_classes = [IsAdminUser]

    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['status']