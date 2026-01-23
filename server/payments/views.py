import requests
from django.conf import settings
from django.utils import timezone
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Payment
from contracts.models import Contract
from projects.models import Project, Proposal
from .serializers import PaymentVerificationSerializer

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
        freelancer_id = serializer.validated_data['freelancer_id']
        total_amount = float(serializer.validated_data['total_amount'])
        
        project = get_object_or_404(Project, id=project_id)
        proposal = Proposal.objects.filter(project=project, freelancer__user_id=freelancer_id).first()

        contract = Contract.objects.create(
            project=project,
            client=request.user,
            freelancer_id=freelancer_id,
            total_amount=total_amount,
            client_signature=serializer.validated_data.get('client_signature'),
            client_signature_type=serializer.validated_data.get('client_signature_type'),
            client_ip=request.META.get('REMOTE_ADDR'),
            client_signed_at=timezone.now(),
            is_funded=True,
            status='offered',
            package=proposal.package if proposal else None
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

        return Response({"message": "Escrow secured via PayPal.", "contract_id": contract.id}, status=201)