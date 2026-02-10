from django.urls import path
from .views import PlatformPercentageView, UserSupportTicketCreateView
urlpatterns = [
    path('platform-percentage/', PlatformPercentageView.as_view()),
    path('support/tickets/create/', UserSupportTicketCreateView.as_view(), name='user-ticket-create'),
]