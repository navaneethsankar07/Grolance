from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContractViewSet, SubmitDeliverableView,RequestRevisionView,FreelancerRevisionActionView , RaiseDisputeView, AdminDisputeViewSet

router = DefaultRouter()
router.register(r'admin/disputes', AdminDisputeViewSet, basename='admin-dispute')
router.register(r'',ContractViewSet,basename='contract')


urlpatterns = [
    path('',include(router.urls)),
    path('dispute/', RaiseDisputeView.as_view(), name='raise-dispute'),
    path('<int:contract_id>/submit-work/', SubmitDeliverableView.as_view(), name='submit-deliverable'),
    path('<int:contract_id>/request-revision/',RequestRevisionView.as_view()),
    path('revisions/<int:revision_id>/action/', FreelancerRevisionActionView.as_view()), 
] 