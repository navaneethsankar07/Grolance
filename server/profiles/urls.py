from django.urls import path
from .views import (
    ClientProfileOverviewAPIView,
    ClientProfileUpdateAPIView,
    FreelancerOnboardingAPIView,
    SendPhoneOTPAPIView,
    VerifyPhoneOTPAPIView,
    FreelancerProfileMeAPIView,
    SwitchRoleAPIView
)
from projects.views import RecommendedProjectsAPIView

urlpatterns = [
    path("me/", ClientProfileOverviewAPIView.as_view(), name="client-profile"),
    path("me/update/", ClientProfileUpdateAPIView.as_view(), name="client-profile-update"),
    path("freelancer/me/", FreelancerProfileMeAPIView.as_view()),
    path("freelancer/onboarding/", FreelancerOnboardingAPIView.as_view()),
    path("freelancer/send-phone-otp/", SendPhoneOTPAPIView.as_view()),
    path("freelancer/verify-phone-otp/", VerifyPhoneOTPAPIView.as_view()),
    path("freelancer/recommended-projects/",RecommendedProjectsAPIView.as_view(),),
    path("auth/switch-role/", SwitchRoleAPIView.as_view()),


]
