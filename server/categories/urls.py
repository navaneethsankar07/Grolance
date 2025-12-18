from django.urls import path
from .views import CategoryListView, SkillListView

urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path("skills/", SkillListView.as_view(),name="skill-list"),
]
