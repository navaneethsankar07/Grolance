import requests
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from profiles.models import FreelancerPaymentSettings
from contracts.models import Contract
from projects.models import Project, Proposal
from .serializers import PaymentVerificationSerializer,ReleasePaymentSerializer, ClientDashboardSerializer
from adminpanel.permissions import IsAdminUser
from django.db.models import Sum,Count,Avg, Q
class VerifyEscrowPaymentView(APIView):
    def get_paypal_token(self):
        url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        if settings.PAYPAL_MODE == 'live':
            url = "https://api-m.paypal.com/v1/oauth2/token"
        
        data = {"grant_type": "client_credentials"}
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        response = requests.post(url, data=data, auth=auth)
        return response.json().get('access_token')

    def post(self, request):
        serializer = PaymentVerificationSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        paypal_order_id = serializer.validated_data['paypal_order_id']
        token = self.get_paypal_token()
        
        base_url = "https://api-m.sandbox.paypal.com" if settings.PAYPAL_MODE == 'sandbox' else "https://api-m.paypal.com"
        verify_url = f"{base_url}/v2/checkout/orders/{paypal_order_id}"
        headers = {"Authorization": f"Bearer {token}"}
        
        res = requests.get(verify_url, headers=headers)
        order_data = res.json()

        if order_data.get('status') != 'COMPLETED':
            return Response({"error": "Payment status not completed on PayPal."}, status=400)

        project_id = serializer.validated_data['project_id']
        freelancer_profile_id = serializer.validated_data['freelancer_id'] 
        total_amount = float(serializer.validated_data['total_amount'])
        
        project = get_object_or_404(Project, id=project_id)
        
        from profiles.models import FreelancerProfile
        freelancer_profile = get_object_or_404(FreelancerProfile, id=freelancer_profile_id)
        freelancer_user = freelancer_profile.user 

        proposal = Proposal.objects.filter(
            project=project, 
            freelancer=freelancer_profile
        ).first()

        selected_package = None

        if proposal:
            selected_package = proposal.package
        else:
            from projects.models import Invitation
            invitation = Invitation.objects.filter(
                project=project,
                freelancer=freelancer_profile,
                status='accepted'
            ).first()
            
            if invitation:
                selected_package = invitation.package
        contract = Contract.objects.create(
            project=project,
            client=request.user,
            freelancer=freelancer_user,
            total_amount=total_amount,
            client_ip=request.META.get('REMOTE_ADDR'),
            client_signed_at=timezone.now(),
            is_funded=True,
            status='offered',
            package=selected_package  
        )

        fee_percent = 0.10
        platform_fee = total_amount * fee_percent
        freelancer_share = total_amount - platform_fee

        Payment.objects.create(
            contract=contract,
            paypal_order_id=paypal_order_id,
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
                project=project,
                freelancer=freelancer_profile,
                status='accepted'
            ).update(status='hired')

        return Response({"message": "Escrow secured via PayPal.", "contract_id": contract.id}, status=201)
    


class ReleasePaymentView(APIView):
    permission_classes = [IsAdminUser] 

    def get_paypal_token(self):
        url = "https://api-m.sandbox.paypal.com/v1/oauth2/token"
        if getattr(settings, 'PAYPAL_MODE', 'sandbox') == 'live':
            url = "https://api-m.paypal.com/v1/oauth2/token"
        
        data = {"grant_type": "client_credentials"}
        auth = (settings.PAYPAL_CLIENT_ID, settings.PAYPAL_SECRET)
        response = requests.post(url, data=data, auth=auth)
        return response.json().get('access_token')

    def post(self, request):
        serializer = ReleasePaymentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        contract_id = serializer.validated_data['contract_id']
        platform_email = serializer.validated_data['platform_paypal_email']
        
        contract = get_object_or_404(Contract, id=contract_id)
        payment_record = get_object_or_404(Payment, contract=contract)
        
        freelancer_payment_info = get_object_or_404(FreelancerPaymentSettings, user=contract.freelancer)
        freelancer_email = freelancer_payment_info.paypal_email

        token = self.get_paypal_token() 
        
        base_url = "https://api-m.sandbox.paypal.com" if getattr(settings, 'PAYPAL_MODE', 'sandbox') == 'sandbox' else "https://api-m.paypal.com"
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
            payment_record.status = 'completed'
            payment_record.save()
            contract.status = 'completed'
            contract.paid_to_freelancer = True
            contract.save()
            project = contract.project
            project.status = 'completed'
            project.is_active = False
            project.save()
            return Response({"message": "Payout initiated successfully."}, status=200)
        
        return Response({
            "error": "PayPal Payout Failed", 
            "details": res_data
        }, status=status.HTTP_400_BAD_REQUEST)



class ClientSpendingSummaryView(APIView):
    def get(self,request):
        user_contracts = Contract.objects.filter(client=request.user)

        stats = user_contracts.aggregate(
            total_spent=Sum('total_amount'),
            projects_completed = Count('id',filter=Q(status='completed')),
            ongoing_projects=Count('id',filter=Q(status='active')),
            avg_per_project=Avg('total_amount',filter=Q())
        )

        recent_contracts = user_contracts.order_by('-client_signed_at')[:5]

        data = {
            'total_spent':stats['total_spent'] or 0,
            'projects_completed':stats['projects_completed'] or 0,
            'ongoing_projects':stats['ongoing_projects'] or 0,
            'avg_per_project':stats['avg_per_project'] or 0,
            'recent_projects': recent_contracts
        }
        serializer = ClientDashboardSerializer(data)
        return Response(serializer.data)