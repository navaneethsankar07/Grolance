from rest_framework.generics import CreateAPIView,ListAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsClientUser, IsFreelancerUser
from .models import Project
from .serializers import ProjectCreateSerializer, ProjectListSerializer, ProjectUpdateSerializer, RecommendedProjectSerializer
from .recommendation import get_recommended_projects
from django.db import models

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