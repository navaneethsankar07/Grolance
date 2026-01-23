from django.urls import path
from .views import VerifyEscrowPaymentView

urlpatterns = [
    path('verify-payment/', VerifyEscrowPaymentView.as_view(), name='verify-payment'),
]