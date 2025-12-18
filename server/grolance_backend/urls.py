from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('api/auth/', include('accounts.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/projects/', include('projects.urls'))
]
