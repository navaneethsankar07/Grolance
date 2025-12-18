from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Category,Skill
from .serializers import CategorySerializer, SkillSerializer

class CategoryListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    def get_queryset(self):
        return Category.objects.filter(is_active=True)


class SkillListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer
    

    def get_queryset(self):
        return Skill.objects.filter(is_active=True)