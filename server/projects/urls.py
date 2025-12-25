from django.urls import path
from .views import ProjectCreateAPIView, ProjectListView

urlpatterns = [
    path("",ProjectListView.as_view(),name='project-list'),
    path("create/", ProjectCreateAPIView.as_view()),
]
