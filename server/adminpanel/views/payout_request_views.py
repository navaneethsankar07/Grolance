# adminpanel/views.py (or payments/views.py)
from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from adminpanel.permissions import IsAdminUser
from contracts.models import Contract
from payments.models import Payment

class PendingPayoutListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        safety_window = timezone.now() - timedelta(minutes=1)

        pending_contracts = Contract.objects.filter(
            status='completed',
            is_funded=True,
            paid_to_freelancer=False,
            completed_at__lte=safety_window 
        ).select_related('project', 'client', 'freelancer')

        data = []
        for contract in pending_contracts:
            payment = Payment.objects.filter(contract=contract).first()
            
            data.append({
                "payment_id": f"PAY-{contract.id}",
                "contract_id": contract.id,
                "project_title": contract.project.title,
                "client_name": contract.client.full_name,
                "freelancer_name": contract.freelancer.full_name,
                "amount": contract.total_amount,
                "freelancer_share": payment.freelancer_share if payment else 0,
                "platform_fee": payment.platform_fee if payment else 0,
                "completed_at": contract.completed_at,
                "status": "Ready to Release",
                "gateway": "PayPal"
            })

        return Response(data)