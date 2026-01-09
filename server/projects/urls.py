from django.urls import path
from .views import ProjectCreateAPIView, ProjectListView, ProjectUpdateAPIView, FreelancerProjectListAPIView, FreelancerProjectDetailView

urlpatterns = [
    path("",ProjectListView.as_view(),name='project-list'),
    path("create/", ProjectCreateAPIView.as_view()),
    path("<int:pk>/", ProjectUpdateAPIView.as_view(), name="project-update"),
    path("freelancer/project-list/", FreelancerProjectListAPIView.as_view(), name='freelancer-project-list' ),
    path('<int:pk>/details/',FreelancerProjectDetailView.as_view(), name='project-detail')
]
