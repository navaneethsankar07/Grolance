from rest_framework.generics import CreateAPIView,ListAPIView, RetrieveUpdateDestroyAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsClientUser, IsFreelancerUser
from .models import Project,Invitation
from .serializers import ProjectCreateSerializer, ProjectListSerializer, ProjectUpdateSerializer, RecommendedProjectSerializer, ProjectDetailSerializer, InvitationSerializer
from .recommendation import get_recommended_projects
from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

class ProjectCreateAPIView(CreateAPIView):
    serializer_class = ProjectCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        print(self.request.data)
        return context


class ProjectListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(client=user)

        status = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.select_related('category').prefetch_related('project_skills__skill').order_by('-created_at')
    

class ProjectUpdateAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProjectUpdateSerializer
    permission_classes = [IsAuthenticated, IsClientUser]
    
    def get_queryset(self):
        return Project.objects.filter(client=self.request.user)


class RecommendedProjectsAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecommendedProjectSerializer

    def get_queryset(self):
        return get_recommended_projects(self.request.user)
    


class FreelancerProjectListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated, IsFreelancerUser]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        queryset = (
            Project.objects
            .exclude(client=self.request.user)
            .filter(status="open", is_active=True)
        )

        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                models.Q(title__icontains=search) | 
                models.Q(description__icontains=search)
            )

        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category__name__icontains=category)
        
        skill = self.request.query_params.get('skill')
        if skill:
            queryset = queryset.filter(
                models.Q(project_skills__skill__name__iexact=skill) |
                models.Q(project_skills__custom_name__iexact=skill)
            ).distinct()

        return (
            queryset
            .select_related("category")
            .prefetch_related("project_skills__skill")
            .order_by("-created_at")
        )
    

class FreelancerProjectDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated,IsFreelancerUser]
    serializer_class = ProjectDetailSerializer
    queryset = Project.objects.filter(is_active = True)

    def get_queryset(self):
        return (
            Project.objects.filter(is_active=True, status="open")
            .select_related('category', 'client__client_profile') # Optimization
            .prefetch_related('project_skills__skill')
        )
    

class InvitationViewSet(viewsets.ModelViewSet):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Invitation.objects.filter(
            models.Q(client=user) | models.Q(freelancer=user)
        ).order_by('-created_at')

    def perform_create(self, serializer):
        serializer.save(client=self.request.user)

    @action(detail=False, methods=['get'])
    def my_eligible_projects(self, request):
        """
        Returns projects owned by the client that are currently 'open'.
        Used by the frontend Modal to populate the 'Select Project' dropdown.
        """
        projects = Project.objects.filter(client=request.user, status='open')
        data = [{"id": p.id, "title": p.title} for p in projects]
        return Response(data)