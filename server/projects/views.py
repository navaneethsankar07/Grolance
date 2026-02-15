from rest_framework.generics import CreateAPIView, ListAPIView, RetrieveUpdateDestroyAPIView, RetrieveAPIView, UpdateAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsClientUser, IsFreelancerUser
from .models import Project, Invitation, Proposal
from .serializers import (
    ProjectCreateSerializer, ProjectListSerializer, ProjectUpdateSerializer,
    RecommendedProjectSerializer, ProjectDetailSerializer, InvitationSerializer,
    ProposalsSerializer, ProposalsListSerializer, FreelancerProposalSerializer
)
from .recommendation import get_recommended_projects
from rest_framework.exceptions import ValidationError, PermissionDenied, NotFound
from django.db import models
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from common.pagination import AdminUserPagination
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
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
            logger.info(
                f"Project '{instance.title}' created by user {self.request.user.id}")
        except ValidationError as e:
            raise e
        except Exception as e:
            logger.error(f"Failed to create project: {str(e)}", exc_info=True)
            raise ValidationError(
                {"error": "An error occurred while creating the project."})


class ProjectListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        try:
            user = self.request.user
            queryset = Project.objects.filter(client=user)
            status_param = self.request.query_params.get('status')
            search = self.request.query_params.get('search')
            if status_param:
                queryset = queryset.filter(status=status_param)
            if search:
                queryset = queryset.filter(title__icontains=search)
            return queryset.select_related('category').prefetch_related('project_skills__skill').order_by('-created_at')
        except Exception as e:
            logger.error(f"Error in ProjectListView queryset: {str(e)}")
            return Project.objects.none()

    def list(self, request, *args, **kwargs):
        try:
            response = super().list(request, *args, **kwargs)
            user = request.user
            base_queryset = Project.objects.filter(client=user)
            search = request.query_params.get('search')
            if search:
                base_queryset = base_queryset.filter(title__icontains=search)
            status_counts = base_queryset.aggregate(
                all=Count('id'),
                completed=Count('id', filter=models.Q(status='completed')),
                in_progress=Count('id', filter=models.Q(status='in_progress')),
                open=Count('id', filter=models.Q(status='open'))
            )
            response.data['counts'] = status_counts
            return response
        except Exception as e:
            logger.error(f"Error in ProjectListView list: {str(e)}")
            return Response({"error": "Could not retrieve project list."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


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
            logger.info(
                f"Project ID {instance.id} updated by user {self.request.user.id}")
        except Exception as e:
            logger.error(
                f"Failed to update project {self.kwargs.get('pk')}: {str(e)}", exc_info=True)
            raise ValidationError(
                {"error": "Failed to update project. Please check your input."})


class RecommendedProjectsAPIView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = RecommendedProjectSerializer

    def get_queryset(self):
        try:
            return get_recommended_projects(self.request.user)
        except Exception as e:
            logger.error(f"Recommendation error: {str(e)}")
            return Project.objects.none()


class FreelancerProjectListAPIView(ListAPIView):
    permission_classes = [IsAuthenticated, IsFreelancerUser]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        try:
            queryset = Project.objects.exclude(
                client=self.request.user).filter(status="open", is_active=True)
            search = self.request.query_params.get('search')
            if search:
                queryset = queryset.filter(
                    models.Q(title__icontains=search) | models.Q(description__icontains=search))
            category = self.request.query_params.get('category')
            if category:
                queryset = queryset.filter(category__name__icontains=category)
            skill = self.request.query_params.get('skill')
            if skill:
                queryset = queryset.filter(models.Q(project_skills__skill__name__iexact=skill) | models.Q(
                    project_skills__custom_name__iexact=skill)).distinct()
            min_price = self.request.query_params.get('min_price')
            max_price = self.request.query_params.get('max_price')
            if min_price:
                queryset = queryset.filter(
                    models.Q(fixed_price__gte=min_price) | models.Q(min_budget__gte=min_price))
            if max_price:
                queryset = queryset.filter(
                    models.Q(fixed_price__lte=max_price) | models.Q(max_budget__lte=max_price))
            delivery_days = self.request.query_params.get('delivery_days')
            if delivery_days:
                queryset = queryset.filter(delivery_days__lte=delivery_days)
            return queryset.select_related("category").prefetch_related("project_skills__skill").order_by("-created_at").distinct()
        except Exception as e:
            logger.error(f"Freelancer search error: {str(e)}")
            return Project.objects.none()


class FreelancerProjectDetailView(RetrieveAPIView):
    permission_classes = [IsAuthenticated, IsFreelancerUser]
    serializer_class = ProjectDetailSerializer

    def get_queryset(self):
        return Project.objects.filter(is_active=True, status="open").select_related('category', 'client__client_profile').prefetch_related('project_skills__skill')


class InvitationViewSet(viewsets.ModelViewSet):
    serializer_class = InvitationSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            user = self.request.user
            return Invitation.objects.filter(models.Q(client=user) | models.Q(freelancer__user=user)).order_by('-created_at')
        except Exception as e:
            logger.error(f"Invitation queryset error: {str(e)}")
            return Invitation.objects.none()

    def perform_create(self, serializer):
        try:
            freelancer = serializer.validated_data.get('freelancer')
            project = serializer.validated_data.get('project')
            if Invitation.objects.filter(project=project, freelancer=freelancer, status__in=['pending', 'accepted']).exists():
                raise ValidationError(
                    {"error": "An active invitation already exists."})
            if Proposal.objects.filter(project=project, freelancer=freelancer).exists():
                raise ValidationError(
                    {"error": "Freelancer has already submitted a proposal."})
            instance = serializer.save(client=self.request.user)
            logger.info(
                f"Invitation ID {instance.id} sent by {self.request.user.id}")
        except ValidationError as e:
            raise e
        except Exception as e:
            logger.error(f"Invitation creation error: {str(e)}")
            raise ValidationError({"error": "Could not send invitation."})

    @action(detail=False, methods=['get'])
    def received(self, request):
        try:
            invitations = Invitation.objects.filter(
                freelancer__user=request.user).order_by('-created_at')
            page = self.paginate_queryset(invitations)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            return Response(self.get_serializer(invitations, many=True).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'])
    def sent(self, request):
        try:
            queryset = Invitation.objects.filter(
                client=request.user).exclude(freelancer__user=request.user)
            project_id = request.query_params.get('project_id')
            if project_id:
                queryset = queryset.filter(project_id=project_id)
            invitations = queryset.order_by('-created_at')
            page = self.paginate_queryset(invitations)
            if page is not None:
                serializer = self.get_serializer(page, many=True)
                return self.get_paginated_response(serializer.data)
            return Response(self.get_serializer(invitations, many=True).data)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['patch'], url_path='update-status')
    def update_status(self, request, pk=None):
        try:
            invitation = self.get_object()
            if invitation.freelancer.user != request.user:
                return Response({"error": "Permission denied"}, status=status.HTTP_403_FORBIDDEN)
            new_status = request.data.get('status')
            if new_status not in ['accepted', 'declined']:
                return Response({"error": "Invalid status"}, status=status.HTTP_400_BAD_REQUEST)
            invitation.status = new_status
            invitation.save()
            return Response(self.get_serializer(invitation).data)
        except ObjectDoesNotExist:
            return Response({"error": "Invitation not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=False, methods=['get'], url_path='my-eligible-projects')
    def my_eligible_projects(self, request):
        try:
            projects = Project.objects.filter(
                client=request.user, status='open')
            data = [{"id": p.id, "title": p.title} for p in projects]
            return Response(data)
        except Exception as e:
            return Response({"error": "Could not fetch eligible projects."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ProposalCreateView(CreateAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalsSerializer
    permission_classes = [IsFreelancerUser]

    def perform_create(self, serializer):
        try:
            serializer.save()
        except ValidationError as e:
            raise e
        except Exception as e:
            logger.error(f"Proposal creation error: {str(e)}")
            raise ValidationError({"error": "Failed to submit proposal."})


class ProposalsListView(ListAPIView):
    serializer_class = ProposalsListSerializer
    permission_classes = [IsClientUser]
    pagination_class = AdminUserPagination

    def get_queryset(self):
        try:
            project_id = self.kwargs.get('project_id')
            queryset = Proposal.objects.filter(
                project_id=project_id).order_by('-created_at')
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            return queryset
        except Exception as e:
            logger.error(f"Proposal list fetch error: {str(e)}")
            return Proposal.objects.none()


class FreelancerProposalsListView(ListAPIView):
    serializer_class = FreelancerProposalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        try:
            queryset = Proposal.objects.filter(
                freelancer__user=self.request.user).order_by('-created_at')
            status_param = self.request.query_params.get('status')
            if status_param:
                queryset = queryset.filter(status=status_param)
            return queryset
        except Exception as e:
            logger.error(f"Freelancer proposals fetch error: {str(e)}")
            return Proposal.objects.none()


class RejectProposalView(UpdateAPIView):
    queryset = Proposal.objects.all()
    serializer_class = ProposalsListSerializer
    permission_classes = [IsClientUser]

    def patch(self, request, *args, **kwargs):
        try:
            proposal = self.get_object()
            if proposal.project.client != request.user:
                return Response({"error": "Permission denied."}, status=status.HTTP_403_FORBIDDEN)
            if proposal.status != 'pending':
                return Response({"error": f"Cannot reject proposal in {proposal.status} status."}, status=status.HTTP_400_BAD_REQUEST)
            proposal.status = 'rejected'
            proposal.save()
            return Response({"message": "Proposal rejected successfully.", "status": proposal.status}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response({"error": "Proposal not found."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.error(f"Proposal rejection error: {str(e)}")
            return Response({"error": "An internal error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
