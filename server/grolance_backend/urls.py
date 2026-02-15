from django.urls import path,include

urlpatterns = [
    path('api/auth/', include('accounts.urls')),
    path('api/categories/', include('categories.urls')),
    path('api/projects/', include('projects.urls')),
    path('api/profile/', include('profiles.urls')),
    path('api/admin/', include('adminpanel.urls')),
    path('api/contracts/' , include('contracts.urls')),
    path('api/payments/', include('payments.urls')),
    path('api/communication/', include('communication.urls')),
    path('api/common/',include('common.urls'))
]

