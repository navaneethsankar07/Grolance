from rest_framework.generics import ListAPIView, CreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Category,Skill
from .serializers import CategorySerializer, SkillSerializer, CategoryWriteSerializer
from adminpanel.permissions import IsAdminUser
from  rest_framework.exceptions import ValidationError

class CategoryListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    pagination_class = None
    def get_queryset(self):
        return Category.objects.all()

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
    pagination_class = None
    

    def get_queryset(self):
        return Skill.objects.all()