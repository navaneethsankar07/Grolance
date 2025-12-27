from django.urls import path
from .views import SendOtpView, VerifyOtpView, ResendOtpView, RefreshTokenView, LoginView, CurrentUserView, LogoutView, ForgotPasswordView, ValidateResetTokenView, ResetPasswordView, GoogleAuthView, ChangePasswordAPIView, DeleteAccountView



urlpatterns = [
    path("send-otp/",SendOtpView.as_view(),name='send_otp'),
    path("verify-otp/", VerifyOtpView.as_view(), name="verify_otp"),
    path("refresh/", RefreshTokenView.as_view(), name="token-refresh-cookie"),
    path("resend-otp/", ResendOtpView.as_view(), name="resend_otp"),
    path("login/", LoginView.as_view(),name='login'),
    path("me/", CurrentUserView.as_view()),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("reset-password/validate/",ValidateResetTokenView.as_view(),name="reset-password-validate"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),
    path("google/", GoogleAuthView.as_view(), name="google-auth"),
    path("change-password/", ChangePasswordAPIView.as_view(), name="change-password"),
    path("delete-account/", DeleteAccountView.as_view(),name='delete-account')
]