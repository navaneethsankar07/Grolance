from rest_framework.generics import CreateAPIView,ListAPIView
from rest_framework.permissions import IsAuthenticated
from .permissions import IsClientUser
from .models import Project
from .serializers import ProjectCreateSerializer, ProjectListSerializer

class ProjectCreateAPIView(CreateAPIView):
    serializer_class = ProjectCreateSerializer
    permission_classes = [IsAuthenticated,IsClientUser]


class ProjectListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ProjectListSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = Project.objects.filter(client=user)

        # Add Filtering
        status = self.request.query_params.get('status')
        search = self.request.query_params.get('search')

        if status:
            queryset = queryset.filter(status=status)
        if search:
            queryset = queryset.filter(title__icontains=search)

        return queryset.select_related('category').prefetch_related('project_skills__skill').order_by('-created_at')
