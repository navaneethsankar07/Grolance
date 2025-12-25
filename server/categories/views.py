from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from .models import Category,Skill
from .serializers import CategorySerializer, SkillSerializer

class CategoryListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CategorySerializer
    def get_queryset(self):
        return Category.objects.all().order_by('id')


class SkillListView(ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = SkillSerializer
    

    def get_queryset(self):
        return Skill.objects.all().order_by('name')