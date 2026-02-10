from django.urls import path
from .views import PlatformPercentageView, UserSupportTicketCreateView, TermsAndConditionsView, PrivacyPolicyView, FAQListView

urlpatterns = [
    path('platform-percentage/', PlatformPercentageView.as_view()),
    path('support/tickets/create/', UserSupportTicketCreateView.as_view(), name='user-ticket-create'),
    path('public/terms-and-conditions/', TermsAndConditionsView.as_view(), name='public-terms'),
    path('public/privacy-policy/', PrivacyPolicyView.as_view(), name='public-privacy'),
    path('public/faq/', FAQListView.as_view(), name='public-faq-list'),
]