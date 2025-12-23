from django.urls import path
from .views import CategoryListView, SkillListView, CategoryDetailView, CategoryCreateView
urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path("skills/", SkillListView.as_view(),name="skill-list"),
    path('<int:pk>/', CategoryDetailView.as_view()),
    path('create/', CategoryCreateView.as_view()),
]
