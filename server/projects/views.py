from rest_framework.generics import CreateAPIView,ListAPIView, RetrieveUpdateDestroyAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsClientUser, IsFreelancerUser
from .models import Project,Invitation, Proposal
from .serializers import ProjectCreateSerializer, ProjectListSerializer, ProjectUpdateSerializer, RecommendedProjectSerializer, ProjectDetailSerializer, InvitationSerializer, ProposalsSerializer, ProposalsListSerializer, FreelancerProposalSerializer
from .recommendation import get_recommended_projects
from rest_framework.exceptions import ValidationError 
from django.db import models
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
import logging

logger = logging.getLogger('projects')

class ProjectCreateAPIView(CreateAPIView):
    serializer_class = ProjectCreateSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context
    def perform_create(self, serializer):
        try:
            instance = serializer.save()
            logger.info(f"Project '{instance.title}' created by user {self.request.user.id}")
        except Exception as e:
            logger.error(f"Failed to create project: {str(e)}", exc_info=True)
            raise


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
    
    def get_serializer_class(self):
        if self.request.method == 'GET':
            return ProjectDetailSerializer
        return ProjectUpdateSerializer
    
    def perform_update(self, serializer):
        try:
            instance = serializer.save()
            logger.info(f"Project ID {instance.id} updated by user {self.request.user.id}")
        except Exception as e:
            logger.error(f"Failed to update project {self.kwargs.get('pk')}: {str(e)}", exc_info=True)
            raise


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

        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')

        if min_price:
            queryset = queryset.filter(
                models.Q(fixed_price__gte=min_price) | 
                models.Q(min_budget__gte=min_price)
            )

        if max_price:
            queryset = queryset.filter(
                models.Q(fixed_price__lte=max_price) | 
                models.Q(max_budget__lte=max_price)
            )

        delivery_days = self.request.query_params.get('delivery_days')
        if delivery_days:
            queryset = queryset.filter(delivery_days__lte=delivery_days)

        return (
            queryset
            .select_related("category")
            .prefetch_related("project_skills__skill")
            .order_by("-created_at")
            .distinct()
        )
    

class FreelancerProjectDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated,IsFreelancerUser]
    serializer_class = ProjectDetailSerializer
    queryset = Project.objects.filter(is_active = True)

    def get_queryset(self):
        return (
            Project.objects.filter(is_active=True, status="open")
            .select_related('category', 'client__client_profile') 
            .prefetch_related('project_skills__skill')
        )
    

class InvitationViewSet(viewsets.ModelViewSet):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Invitation.objects.filter(
            models.Q(client=user) | models.Q(freelancer=user)
        ).exclude(client=user, freelancer=user).order_by('-created_at')

    def perform_create(self, serializer):
        freelancer = serializer.validated_data.get('freelancer')
        project = serializer.validated_data.get('project')
        
        exists = Invitation.objects.filter(
            project=project,
            freelancer=freelancer,
            status__in=['pending', 'accepted']
        ).exists()

        if exists:
            raise ValidationError({
                "error": "An active invitation already exists for this freelancer on this project."
            })

        try:
            instance = serializer.save(client=self.request.user)
            logger.info(f"Invitation ID {instance.id} sent by client {self.request.user.id} to freelancer {instance.freelancer.id}")
        except Exception as e:
            logger.error(f"Failed to send invitation: {str(e)}", exc_info=True)
            raise

    @action(detail=False, methods=['get'])
    def received(self, request):
        invitations = Invitation.objects.filter(freelancer=request.user).exclude(client=request.user).order_by('-created_at')
        page = self.paginate_queryset(invitations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(invitations, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def sent(self, request):
        queryset = Invitation.objects.filter(client=request.user).exclude(freelancer=request.user)
        
        project_id = request.query_params.get('project_id')
        if project_id:
            queryset = queryset.filter(project_id=project_id)
            
        invitations = queryset.order_by('-created_at')
        
        page = self.paginate_queryset(invitations)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(invitations, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        invitation = self.get_object()
        
        if invitation.freelancer != request.user:
            return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
        
        new_status = request.data.get('status')
        if new_status not in ['accepted', 'declined']:
            return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
        
        invitation.status = new_status
        invitation.save()
        
        logger.info(f"Invitation {invitation.id} set to {new_status} by {request.user.id}")
        return Response(self.get_serializer(invitation).data)

    @action(detail=False, methods=['get'], url_path='my-eligible-projects')
    def my_eligible_projects(self, request):
        projects = Project.objects.filter(client=request.user, status='open')
        data = [{"id": p.id, "title": p.title} for p in projects]
        return Response(data)
    

class ProposalCreateView(CreateAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalsSerializer
    permission_classes = [IsFreelancerUser]

    def perform_create(self, serializer):
        serializer.save()

class ProposalsListView(ListAPIView):
    serializer_class = ProposalsListSerializer
    permission_classes = [IsClientUser]

    def get_queryset(self):
        project_id = self.kwargs.get('project_id')
        return Proposal.objects.filter(project_id = project_id).order_by('-created_at')
    
class FreelancerProposalsListView(ListAPIView):
    serializer_class = FreelancerProposalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Proposal.objects.filter(
            freelancer__user=self.request.user
        ).order_by('-created_at')

        status = self.request.query_params.get('status')
        if status:
            queryset= queryset.filter(status=status)

        return queryset