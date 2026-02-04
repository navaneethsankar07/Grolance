from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from adminpanel.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from projects.models import Project,Proposal
from contracts.models import Contract
from payments.models import Payment

User = get_user_model()

class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self,request):
        withdrawal_threshold = timezone.now() - timedelta(hours=24)
        pending_withdrawals_query = Payment.objects.filter(
            status='escrow',
            contract__status='completed',
            contract__completed_at__lte=withdrawal_threshold
        )
        stats = {
            'total_users':User.objects.exclude(email=request.user.email).count(),
            'total_projects':Project.objects.count(),
            'active_contracts':Contract.objects.filter(status='active').count(),
            'total_proposals':Proposal.objects.count(),
            'platform_revenue':Payment.objects.filter(status__in=['completed','released']).aggregate(total=Sum('platform_fee'))['total'] or 0,
            'pending_withdrawals': pending_withdrawals_query.aggregate(
                total=Sum('freelancer_share'))['total'] or 0,
        }
        return Response(stats)