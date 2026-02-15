from rest_framework import generics, status
from rest_framework import viewsets
from rest_framework.response import Response
from common.models import CMSSection,FAQ
from common.serializers import CMSSectionSerializer,FAQAdminSerializer
from adminpanel.permissions import IsAdminUser
import logging

logger = logging.getLogger(__name__)

class AdminCMSSectionListCreateView(generics.ListCreateAPIView):
    serializer_class = CMSSectionSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        category = self.request.query_params.get('category')
        if category:
            return CMSSection.objects.filter(category=category)
        return CMSSection.objects.all()

    def patch(self, request, *args, **kwargs):
        section_id = request.data.get('id')
        if not section_id:
            return Response(
                {"error": "ID is required to update a section."},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            instance = CMSSection.objects.get(pk=section_id)
            serializer = self.get_serializer(instance, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return Response(serializer.data)
        except CMSSection.DoesNotExist:
            return Response(
                {"error": "Section not found."},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            logger.error(f"Error updating CMS section {section_id}: {str(e)}")
            return Response(
                {"error": "An unexpected error occurred during update."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdminCMSSectionDeleteView(generics.DestroyAPIView):
    queryset = CMSSection.objects.all()
    serializer_class = CMSSectionSerializer
    permission_classes = [IsAdminUser]

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except Exception as e:
            logger.error(f"Error deleting CMS section {kwargs.get('pk')}: {str(e)}")
            return Response(
                {"error": "Failed to delete the section."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        


class FAQAdminViewSet(viewsets.ModelViewSet):
    queryset = FAQ.objects.all()
    serializer_class = FAQAdminSerializer
    permission_classes = [IsAdminUser]