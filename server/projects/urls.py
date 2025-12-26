from django.urls import path
from .views import ProjectCreateAPIView, ProjectListView, ProjectUpdateAPIView

urlpatterns = [
    path("",ProjectListView.as_view(),name='project-list'),
    path("create/", ProjectCreateAPIView.as_view()),
    path("<int:pk>/", ProjectUpdateAPIView.as_view(), name="project-update")
]
