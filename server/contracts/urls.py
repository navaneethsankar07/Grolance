from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, SubmitDeliverableView

router = DefaultRouter()
router.register(r'',ContractViewSet,basename='contract')


urlpatterns = [
    path('',include(router.urls)),
    path('<int:contract_id>/submit-work/', SubmitDeliverableView.as_view(), name='submit-deliverable'),
] 