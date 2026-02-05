from django.urls import path
from .views.user_views import (
    AdminUserListAPIView,
    AdminToggleUserActiveAPIView,
    AdminSoftDeleteUserAPIView,
)
from .views.payout_request_views import PendingPayoutListView
from .views.dashboard_views import AdminDashboardView, AdminRevenueChartView,AdminProposalsChartView
urlpatterns = [
    path("users/", AdminUserListAPIView.as_view(), name="admin-user-list"),
    path("users/<int:user_id>/toggle-active/",AdminToggleUserActiveAPIView.as_view(),name="admin-user-toggle-active",),
    path("users/<int:user_id>/soft-delete/",AdminSoftDeleteUserAPIView.as_view(),name="admin-user-soft-delete",),
    path('pending-payouts/', PendingPayoutListView.as_view(), name='pending-payouts'),
    path('dashboard-stats/',AdminDashboardView.as_view(), name='admin-dashboard-stats'),
    path('revenue-chart/', AdminRevenueChartView.as_view(), name='admin-revenue-chart'),
    path('proposals-chart',AdminProposalsChartView.as_view(), name='admin-proposals-chart')
]