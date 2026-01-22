from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from .models import Contract, ContractRevision
from .serializers import ContractSerializer, ContractOfferSerializer, ContractAcceptSerializer, ContractDeliverableSerializer

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
        queryset = Contract.objects.filter(Q(client=user) | Q(freelancer=user)).prefetch_related('deliverables')
        
        status_param = self.request.query_params.get('status')
        if status_param and status_param != 'All':
            status_map = {
                'In Progress': 'active',
                'Submitted': 'submitted',
                'Completed': 'completed',
                'Disputed': 'disputed'
            }
            db_status = status_map.get(status_param, status_param.lower())
            queryset = queryset.filter(status=db_status)

        role_param = self.request.query_params.get('role')
        if role_param == 'client':
            queryset = queryset.filter(client=user)
        elif role_param == 'freelancer':
            queryset = queryset.filter(freelancer=user)

        if self.action == 'list':
            return queryset.exclude(status='offered').order_by('-client_signed_at')
        
        return queryset

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
        project_id = self.request.data.get('project')
        freelancer_id = self.request.data.get('freelancer')
        
        from projects.models import Proposal
        proposal = Proposal.objects.filter(project_id=project_id, freelancer__user_id=freelancer_id).first()
        
        serializer.save(
            client=self.request.user,
            client_ip=client_ip,
            is_funded=True, 
            status='offered',
            client_signed_at=timezone.now(),
            package=proposal.package if proposal else None 
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

    @action(detail=True, methods=['patch'])
    def status_update(self, request, pk=None):
        contract = self.get_object()
        new_status = request.data.get('status')
        
        if new_status == 'completed' and contract.client == request.user:
            contract.status = 'completed'
            contract.save()
            return Response({"message": "Order marked as completed."})
        
        return Response({"error": "Invalid action."}, status=400)

class SubmitDeliverableView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id)
            
            if contract.freelancer != request.user:
                return Response(
                    {"error": "You are not authorized to submit work for this contract."}, 
                    status=status.HTTP_403_FORBIDDEN
                )

            if contract.status not in ['active', 'submitted']:
                return Response(
                    {"error": "Work can only be submitted for active contracts."}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            serializer = ContractDeliverableSerializer(
                data=request.data, 
                context={'request': request}
            )
            
            if serializer.is_valid():
                serializer.save(freelancer=request.user, contract=contract)
                contract.status = 'submitted'
                contract.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        except Contract.DoesNotExist:
            return Response({"error": "Contract not found."}, status=status.HTTP_404_NOT_FOUND)

class RequestRevisionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id, client=request.user)
            
            if contract.status != 'submitted':
                return Response(
                    {"error": "Revisions can only be requested for submitted work."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            reason = request.data.get('reason')
            if not reason or len(reason) < 10:
                return Response(
                    {"error": "Detailed reason (min 10 chars) is required."},
                    status=status.HTTP_400_BAD_REQUEST
                )

            ContractRevision.objects.create(
                contract=contract,
                requested_by=request.user,
                reason=reason,
                status='pending'
            )

            return Response({"message": "Revision requested. Waiting for freelancer response."})

        except Contract.DoesNotExist:
            return Response({"error": "Contract not found."}, status=status.HTTP_404_NOT_FOUND)

class FreelancerRevisionActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, revision_id):
        try:
            revision = ContractRevision.objects.get(
                id=revision_id, 
                contract__freelancer=request.user
            )
            
            action = request.data.get('action')
            
            if action == 'accept':
                revision.status = 'accepted'
                revision.contract.status = 'active'
                revision.contract.save()
                revision.save()
                return Response({"message": "Revision accepted. Contract is now active."})
                
            elif action == 'reject':
                message = request.data.get('message')
                if not message:
                    return Response({"error": "Please provide a reason for rejection."}, status=400)
                
                revision.status = 'rejected'
                revision.rejection_message = message
                revision.save()
                return Response({"message": "Revision rejected successfully."})
            
            return Response({"error": "Invalid action."}, status=400)

        except ContractRevision.DoesNotExist:
            return Response({"error": "Revision request not found."}, status=404)