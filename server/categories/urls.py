from django.urls import path
from .views import CategoryListView, SkillListView, SkillCreateView,SkillDetailView, CategoryDetailView, CategoryCreateView
urlpatterns = [
    path("", CategoryListView.as_view(), name="category-list"),
    path('<int:pk>/', CategoryDetailView.as_view()),
    path('create/', CategoryCreateView.as_view()),
    path("skills/", SkillListView.as_view(),name="skill-list"),
    path("skills/create/", SkillCreateView.as_view(),name="skill-create"),
    path("skills/<int:pk>/", SkillDetailView.as_view(),name="skill-detail"),
]
