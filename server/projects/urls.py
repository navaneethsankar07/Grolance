from django.urls import path
from .views import ProjectCreateAPIView

urlpatterns = [
    path("create/", ProjectCreateAPIView.as_view()),
]
