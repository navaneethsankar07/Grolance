from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Contract
from .serializers import ContractSerializer, ContractOfferSerializer, ContractAcceptSerializer

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ContractOfferSerializer
        if self.action == 'accept':
            return ContractAcceptSerializer
        return ContractSerializer
    
    def get_queryset(self):
        user = self.request.user
        base_queryset = Contract.objects.filter(Q(client=user) | Q(freelancer=user))
        
        if self.action == 'list':
            return base_queryset.exclude(status='offered').order_by('-client_signed_at')
        return base_queryset

    @action(detail=False, methods=['get'])
    def my_offers(self, request):
        offers = Contract.objects.filter(
            freelancer=request.user, 
            status='offered'
        ).order_by('-client_signed_at')
        serializer = self.get_serializer(offers, many=True)
        return Response(serializer.data)

    def perform_create(self, serializer):
        client_ip = self.request.META.get('REMOTE_ADDR')
        serializer.save(
            client=self.request.user,
            client_ip=client_ip,
            is_funded=True, 
            status='offered',
            client_signed_at=timezone.now()
        )

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        contract = self.get_object()
        
        if request.user != contract.freelancer:
            return Response({"error": "Only authorized freelancer can sign."}, status=403)
        
        serializer = self.get_serializer(contract, data=request.data)
        if serializer.is_valid():
            contract.freelancer_ip = request.META.get('REMOTE_ADDR')
            contract.freelancer_signed_at = timezone.now()
            contract.status = 'active'
            contract.save()

            project = contract.project
            project.status = 'in_progress'
            project.save()

            from projects.models import Proposal
            Proposal.objects.filter(
                project=project, 
                freelancer__user=contract.freelancer
            ).update(status='accepted')

            return Response({"status": "Contract is now active and project started!"})
        
        return Response(serializer.errors, status=400)