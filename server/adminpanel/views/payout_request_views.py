from datetime import timedelta
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from adminpanel.permissions import IsAdminUser
from contracts.models import Contract
from payments.models import Payment
from django.db.models import Q

class PendingPayoutListView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        safety_window = timezone.now() - timedelta(minutes=1)

        pending_contracts = Contract.objects.filter(
            Q(status='completed', completed_at__lte=safety_window) | 
            Q(status='completed', disputes__status__in=['resolved', 'rejected']),
            is_funded=True,
            paid_to_freelancer=False,
        ).exclude(
            escrow_details__status__in=['released', 'refunded']
        ).select_related('project', 'client', 'freelancer').prefetch_related('disputes','disputes__opened_by_client', 'disputes__opened_by_freelancer').distinct()
        

        data = []
        for contract in pending_contracts:
            payment = Payment.objects.filter(contract=contract).first()
            dispute = contract.disputes.first()

            dispute_raised_by = None
            if dispute:
                if dispute.opened_by_client:
                    dispute_raised_by = 'client'
                elif dispute.opened_by_freelancer:
                    dispute_raised_by = 'freelancer'
            
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
                "status": contract.status,
                'dispute_status':dispute.status if dispute else None,
                "dispute_raised_by": dispute_raised_by,
                "gateway": "PayPal"
            })

        return Response(data)