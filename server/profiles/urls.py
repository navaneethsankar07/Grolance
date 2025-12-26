from django.urls import path
from .views import (
    ClientProfileOverviewAPIView,
    ClientProfileUpdateAPIView,
)

urlpatterns = [
    path("me/", ClientProfileOverviewAPIView.as_view(), name="client-profile"),
    path("me/update/", ClientProfileUpdateAPIView.as_view(), name="client-profile-update"),
]
