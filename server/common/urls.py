from django.urls import path
from .views import PlatformPercentageView
urlpatterns = [
    path('platform-percentage/', PlatformPercentageView.as_view())
]