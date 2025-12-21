<<<<<<< HEAD
from django.contrib import admin
=======
>>>>>>> features/admin
from django.urls import path,include

urlpatterns = [
    path('api/auth/', include('accounts.urls')),
    path('api/categories/', include('categories.urls')),
<<<<<<< HEAD
    path('api/projects/', include('projects.urls'))
]
=======
    path('api/projects/', include('projects.urls')),
    path('api/admin/', include('adminpanel.urls'))

]

>>>>>>> features/admin
