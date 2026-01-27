from django.urls import path
from .views import VerifyEscrowPaymentView,ReleasePaymentView,ClientSpendingSummaryView, FreelancerTransactionView

urlpatterns = [
    path('verify-payment/', VerifyEscrowPaymentView.as_view(), name='verify-payment'),
    path('release-payout/', ReleasePaymentView.as_view(), name='release-payout'),
    path('client/spending-summary/',ClientSpendingSummaryView.as_view(), name='spending-summary'),
    path('freelancer/transaction-history/', FreelancerTransactionView.as_view(), name='transaction-history')
]