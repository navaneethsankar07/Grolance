from django.urls import path
from .views.user_views import (
    AdminUserListAPIView,
    AdminToggleUserActiveAPIView,
    AdminSoftDeleteUserAPIView,
)
from .views.platform_settings_views import GlobalSettingsView
from .views.payout_request_views import PendingPayoutListView
from .views.dashboard_views import AdminDashboardView, AdminRevenueChartView,AdminProposalsChartView
from .views.support_ticket_views import SupportTicketDetailView, SupportTicketListView
urlpatterns = [
    path("users/", AdminUserListAPIView.as_view(), name="admin-user-list"),
    path("users/<int:user_id>/toggle-active/",AdminToggleUserActiveAPIView.as_view(),name="admin-user-toggle-active",),
    path("users/<int:user_id>/soft-delete/",AdminSoftDeleteUserAPIView.as_view(),name="admin-user-soft-delete",),
    path('pending-payouts/', PendingPayoutListView.as_view(), name='pending-payouts'),
    path('dashboard-stats/',AdminDashboardView.as_view(), name='admin-dashboard-stats'),
    path('revenue-chart/', AdminRevenueChartView.as_view(), name='admin-revenue-chart'),
    path('proposals-chart',AdminProposalsChartView.as_view(), name='admin-proposals-chart'),
    path('settings/global/', GlobalSettingsView.as_view(), name='global-settings'),
    path('support/tickets/', SupportTicketListView.as_view(), name='admin-support-ticket-list'),
    path('support/tickets/<int:pk>/', SupportTicketDetailView.as_view(), name='admin-support-ticket-detail'),

]