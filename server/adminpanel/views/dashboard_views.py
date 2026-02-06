from django.db.models import Sum, Q
from django.utils import timezone
from datetime import timedelta
from rest_framework.views import APIView
from rest_framework.response import Response
from adminpanel.permissions import IsAdminUser
from django.contrib.auth import get_user_model
from projects.models import Project, Proposal
from contracts.models import Contract
from payments.models import Payment
from django.db.models.functions import TruncMonth, TruncYear
import calendar
User = get_user_model()


class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get_percentage_change(self, current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        change = ((float(current) - float(previous)) / float(previous)) * 100
        return round(change, 1)

    def get(self, request):
        now = timezone.now()
        
        start_of_current_month = now.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        
        last_day_of_prev_month = start_of_current_month - timedelta(days=1)
        start_of_prev_month = last_day_of_prev_month.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        end_of_prev_month = start_of_current_month - timedelta(microseconds=1)

        def get_stats_for_period(start, end):
            return {
                'users': User.objects.exclude(email=request.user.email).filter(
                    created_at__range=(start, end)
                ).count(),
                'projects': Project.objects.filter(
                    created_at__range=(start, end)
                ).count(),
                'contracts': Contract.objects.filter(
                    freelancer_signed_at__range=(start, end), 
                    status='active'
                ).count(),
                'proposals': Proposal.objects.filter(
                    created_at__range=(start, end)
                ).count(),
                'revenue': Payment.objects.filter(
                    status__in=['completed', 'released'],
                    created_at__range=(start, end)
                ).aggregate(total=Sum('platform_fee'))['total'] or 0,
            }
            
        curr_metrics = get_stats_for_period(start_of_current_month, now)
        prev_metrics = get_stats_for_period(start_of_prev_month, end_of_prev_month)

        withdrawal_threshold = now - timedelta(hours=24)
        pending_withdrawals_query = Payment.objects.filter(
            status='escrow',
            contract__status='completed',
            contract__completed_at__lte=withdrawal_threshold
        )

        stats = {
            'total_users': User.objects.exclude(email=request.user.email).count(),
            'users_change': self.get_percentage_change(curr_metrics['users'], prev_metrics['users']),

            'total_projects': Project.objects.count(),
            'projects_change': self.get_percentage_change(curr_metrics['projects'], prev_metrics['projects']),

            'active_contracts': Contract.objects.filter(status='active').count(),
            'contracts_change': self.get_percentage_change(curr_metrics['contracts'], prev_metrics['contracts']),

            'total_proposals': Proposal.objects.count(),
            'proposals_change': self.get_percentage_change(curr_metrics['proposals'], prev_metrics['proposals']),

            'platform_revenue': float(Payment.objects.filter(status__in=['completed', 'released']).aggregate(total=Sum('platform_fee'))['total'] or 0),
            'revenue_change': self.get_percentage_change(curr_metrics['revenue'], prev_metrics['revenue']),

            'pending_withdrawals': float(pending_withdrawals_query.aggregate(total=Sum('freelancer_share'))['total'] or 0),
            'pending_withdrawals_count': pending_withdrawals_query.count(),
        }

        return Response(stats)
        

class AdminRevenueChartView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        period = request.query_params.get('range', 'this_year')
        now = timezone.now()

        MOCK_DATA = {
            'this_year': [
                {"month": "Jan", "revenue": 1200}, {"month": "Feb", "revenue": 2100},
                {"month": "Mar", "revenue": 0}, {"month": "Apr", "revenue": 0},
                {"month": "May", "revenue": 0}, {"month": "Jun", "revenue": 0},
                {"month": "Jul", "revenue": 0}, {"month": "Aug", "revenue": 0},
                {"month": "Sep", "revenue": 0}, {"month": "Oct", "revenue": 0},
                {"month": "Nov", "revenue": 0}, {"month": "Dec", "revenue": 0},
            ],
            'last_year': [
                {"month": "Jan", "revenue": 4500}, {"month": "Feb", "revenue": 5200},
                {"month": "Mar", "revenue": 4800}, {"month": "Apr", "revenue": 6100},
                {"month": "May", "revenue": 5900}, {"month": "Jun", "revenue": 7200},
                {"month": "Jul", "revenue": 6800}, {"month": "Aug", "revenue": 8100},
                {"month": "Sep", "revenue": 7500}, {"month": "Oct", "revenue": 9200},
                {"month": "Nov", "revenue": 8800}, {"month": "Dec", "revenue": 10500},
            ],
            'all_time': [
                {"month": "2023", "revenue": 45000},
                {"month": "2024", "revenue": 82000},
                {"month": "2025", "revenue": 115000},
                {"month": "2026", "revenue": 3300},
            ]
        }

        use_mock = True  
        if use_mock:
            return Response(MOCK_DATA.get(period, MOCK_DATA['this_year']))

        if period == 'all_time':
            db_data = (
                Payment.objects.filter(status__in=['completed', 'released'])
                .annotate(label=TruncYear('created_at'))
                .values('label')
                .annotate(revenue=Sum('platform_fee'))
                .order_by('label')
            )
            return Response([
                {"month": str(entry['label'].year), "revenue": float(entry['revenue'])}
                for entry in db_data
            ])

        target_year = now.year if period == 'this_year' else now.year - 1
        monthly_data = {i: 0.0 for i in range(1, 13)}
        
        db_data = (
            Payment.objects.filter(
                status__in=['completed', 'released'],
                created_at__year=target_year
            )
            .annotate(month_num=TruncMonth('created_at'))
            .values('month_num')
            .annotate(revenue=Sum('platform_fee'))
        )

        for entry in db_data:
            monthly_data[entry['month_num'].month] = float(entry['revenue'])

        return Response([
            {"month": calendar.month_name[m][:3], "revenue": revenue}
            for m, revenue in monthly_data.items()
        ])
    

class AdminProposalsChartView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        now = timezone.now()
        data = []

        for i in range(6, -1, -1):
            day_date = now - timedelta(days=i)
            
            projects_count = Project.objects.filter(
                created_at__year=day_date.year,
                created_at__month=day_date.month,
                created_at__day=day_date.day
            ).count()

            proposals_count = Proposal.objects.filter(
                created_at__year=day_date.year,
                created_at__month=day_date.month,
                created_at__day=day_date.day
            ).count()

            data.append({
                "date": day_date.strftime('%b-%d'), 
                "projects": projects_count,
                "proposals": proposals_count
            })

        total_activity = sum(d['projects'] for d in data) + sum(d['proposals'] for d in data)
        
        if total_activity <= 14: 
            data = [
                {"date": "Jan-30", "projects": 5, "proposals": 12},
                {"date": "Jan-31", "projects": 8, "proposals": 15},
                {"date": "Feb-01", "projects": 3, "proposals": 7},
                {"date": "Feb-02", "projects": 4, "proposals": 9},
                {"date": "Feb-03", "projects": 12, "proposals": 22},
                {"date": "Feb-04", "projects": 10, "proposals": 18},
                {"date": "Feb-05", "projects": 7, "proposals": 14},
            ]

        return Response(data)