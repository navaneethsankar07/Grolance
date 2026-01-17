from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Contract
from .serializers import ContractSerializer, ContractOfferSerializer, ContractAcceptSerializer

class ContractViewSet(viewsets.ModelViewSet):
    print('hello')
    queryset = Contract.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ContractOfferSerializer
        if self.action == 'accept':
            return ContractAcceptSerializer
        return ContractSerializer

    def perform_create(self, serializer):
        client_ip = self.request.META.get('REMOTE_ADDR')
        serializer.save(
            client=self.request.user,
            client_ip=client_ip,
            is_funded=True, 
            status='offered'
        )

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        contract = self.get_object()
        
        if request.user != contract.freelancer:
            return Response({"error": "Only the assigned freelancer can sign this."}, status=403)
        
        serializer = self.get_serializer(contract, data=request.data)
        if serializer.is_valid():
            import datetime
            contract.freelancer_ip = request.META.get('REMOTE_ADDR')
            contract.freelancer_signed_at = datetime.datetime.now()
            contract.status = 'active'
            serializer.save()
            return Response({"status": "Contract is now active!"})
        
        return Response(serializer.errors, status=400)