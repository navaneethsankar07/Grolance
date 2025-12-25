from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Category,Skill
from .serializers import CategorySerializer, SkillSerializer, CategoryWriteSerializer, SkillWriteSerializer
from adminpanel.permissions import IsAdminUser
from  rest_framework.exceptions import ValidationError
from common.pagination import AdminPageNumberPagination
from rest_framework.filters import SearchFilter, OrderingFilter

class CategoryListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    pagination_class = AdminPageNumberPagination
    filter_backends = [SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering = ["-id"]
    def get_queryset(self):
        return Category.objects.all().order_by('id')

class CategoryCreateView(CreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = CategoryWriteSerializer
    queryset = Category.objects.all()



class CategoryDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = CategoryWriteSerializer
    queryset = Category.objects.all()

    def perform_destroy(self, instance):
        if instance.skills.exists():
            raise ValidationError(
            "This category is in use and cannot be deleted."
        )

        instance.delete()

class SkillListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer
    pagination_class = AdminPageNumberPagination
    filter_backends = [SearchFilter, OrderingFilter]
    SearchFilter = ["name", "category_name"]
    ordering = ["-id"]
    

    def get_queryset(self):
        return Skill.objects.select_related("category").all()

class SkillCreateView(CreateAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SkillWriteSerializer
    queryset = Skill.objects.all()


class SkillDetailView(RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAdminUser]
    serializer_class = SkillWriteSerializer
    queryset = Skill.objects.all()

    def perform_destroy(self, instance):
        # Future-proof check (example)
        if hasattr(instance, "projects") and instance.projects.exists():
            raise ValidationError(
                "This skill is in use and cannot be deleted."
            )

        instance.delete()
