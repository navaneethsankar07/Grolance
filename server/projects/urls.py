from django.urls import path,include 
from .views import ProjectCreateAPIView, ProjectListView, ProjectUpdateAPIView, FreelancerProjectListAPIView, FreelancerProjectDetailView, InvitationViewSet, ProposalCreateView, ProposalsListView, FreelancerProposalsListView
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'invitations', InvitationViewSet, basename='invitation')
urlpatterns = [
    path("",ProjectListView.as_view(),name='project-list'),
    path("create/", ProjectCreateAPIView.as_view()),
    path("<int:pk>/", ProjectUpdateAPIView.as_view(), name="project-update"),
    path("freelancer/project-list/", FreelancerProjectListAPIView.as_view(), name='freelancer-project-list' ),
    path('<int:pk>/details/',FreelancerProjectDetailView.as_view(), name='project-detail'),
    path("", include(router.urls)),
    path('create-proposal/',ProposalCreateView.as_view()),
    path('<int:project_id>/proposals/', ProposalsListView.as_view()),
    path('my-proposals/',FreelancerProposalsListView.as_view())
]
