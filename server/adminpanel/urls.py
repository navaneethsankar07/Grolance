from django.urls import path, include
from .views.user_views import (
    AdminUserListAPIView,
    AdminToggleUserActiveAPIView,
    AdminSoftDeleteUserAPIView,
)
from .views.platform_settings_views import GlobalSettingsView
from .views.payout_request_views import PendingPayoutListView
from .views.dashboard_views import AdminDashboardView, AdminRevenueChartView,AdminProposalsChartView
from .views.support_ticket_views import SupportTicketDetailView, SupportTicketListView
from .views.cms_views import AdminCMSSectionListCreateView, AdminCMSSectionDeleteView, FAQAdminViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'faq', FAQAdminViewSet, basename='admin-faq')

urlpatterns = [
    path('', include(router.urls)),
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
    path('cms/',AdminCMSSectionListCreateView.as_view(), name='admin-cms-list-create'),
    path('cms/<int:pk>/delete/', AdminCMSSectionDeleteView.as_view(), name='admin-cms-delete'),

]