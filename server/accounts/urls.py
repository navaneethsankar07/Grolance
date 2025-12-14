from django.urls import path
from .views import SendOtpView, VerifyOtpView, ResendOtpView, RefreshTokenView, LoginView, CurrentUserView, LogoutView



urlpatterns = [
    path("send-otp/",SendOtpView.as_view(),name='send_otp'),
    path("verify-otp/", VerifyOtpView.as_view(), name="verify_otp"),
    path("refresh/", RefreshTokenView.as_view(), name="token-refresh-cookie"),
    path("resend-otp/", ResendOtpView.as_view(), name="resend_otp"),
    path("login/", LoginView.as_view(),name='login'),
    path("me/", CurrentUserView.as_view()),
    path("logout/", LogoutView.as_view(), name="logout"),

]