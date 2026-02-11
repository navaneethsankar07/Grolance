from django.urls import path
from .views import (
    ClientProfileOverviewAPIView,
    ClientProfileUpdateAPIView,
    FreelancerOnboardingAPIView,
    SendPhoneOTPAPIView,
    VerifyPhoneOTPAPIView,
    FreelancerProfileMeAPIView,
    SwitchRoleAPIView,
    FreelancerProfileManageAPIView,
    FreelancerListAPIView,
    FreelancerPublicProfileAPIView,
    FreelancerPaymentSettingsUpdateView,
    ReviewCreateView,
    FreelancerReviewListView,
    ClientReviewListView
    
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
    path("switch-role/", SwitchRoleAPIView.as_view()),
    path('freelancer/profile/',FreelancerProfileManageAPIView.as_view(),name='freelancer-profile'),
    path('freelancers-list/', FreelancerListAPIView.as_view(), name='freelancer-list'),
    path('freelancer/profile/<int:id>/', FreelancerPublicProfileAPIView.as_view(), name='public-profile'),
    path('freelancer/payment-settings/', FreelancerPaymentSettingsUpdateView.as_view(), name='payment-settings-update'),
    path('reviews/create/', ReviewCreateView.as_view(), name='review-create'),
    path('reviews/freelancer/<int:user_id>/', FreelancerReviewListView.as_view(), name='freelancer-reviews'),
    path('reviews/client/<int:user_id>/', ClientReviewListView.as_view(), name='client-reviews'),
    path('freelancers/<int:freelancer_id>/reviews/', FreelancerReviewListView.as_view(), name='freelancer-reviews'),
]
