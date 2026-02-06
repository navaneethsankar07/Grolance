from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from adminpanel.permissions import IsAdminUser
from projects.permissions import IsClientUser, IsFreelancerUser
from django.core.exceptions import ObjectDoesNotExist
from .models import Contract, ContractRevision, Dispute, DisputeFile
from .serializers import ContractSerializer, ContractOfferSerializer, ContractAcceptSerializer, ContractDeliverableSerializer,DisputeSerializer, AdminDisputeListSerializer, AdminDisputeDetailSerializer
import logging
from .utils import generate_contract_pdf
from django.db import transaction
from projects.models import Proposal

logger = logging.getLogger('contracts')

class ContractViewSet(viewsets.ModelViewSet):
    queryset = Contract.objects.all()

    def get_serializer_class(self):
        if self.action == 'create':
            return ContractOfferSerializer
        if self.action == 'accept':
            return ContractAcceptSerializer
        return ContractSerializer
    
    def get_queryset(self):
        try:
            user = self.request.user
            queryset = Contract.objects.filter(Q(client=user) | Q(freelancer=user)).select_related(
                'project', 'project__category', 'client', 'package', 'freelancer'
            ).prefetch_related('deliverables', 'revisions','disputes')
            
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
        except Exception as e:
            logger.error(f"Error in get_queryset: {str(e)}")
            return Contract.objects.none()

    @action(detail=False, methods=['get'])
    def my_offers(self, request):
        try:
            offers = Contract.objects.filter(
                freelancer=request.user, 
                status='offered'
            ).order_by('-client_signed_at')
            serializer = self.get_serializer(offers, many=True)
            return Response(serializer.data)
        except Exception as e:
            logger.error(f"Error in my_offers: {str(e)}")
            return Response({"error": "Failed to fetch offers."}, status=500)
    
    def create(self, request, *args, **kwargs):
        logger.warning(f"Direct contract creation attempt blocked for user {request.user.id}")
        return Response({"error": "Use payment flow to create contracts"}, status=405)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        try:
            contract = self.get_object()
            
            if request.user != contract.freelancer:
                logger.warning(f"Unauthorized acceptance attempt on contract {contract.id} by user {request.user.id}")
                return Response({"error": "Only authorized freelancer can sign."}, status=403)
            
            serializer = self.get_serializer(contract, data=request.data)
            if serializer.is_valid():
                contract.freelancer_signature = request.data.get('freelancer_signature')
                contract.freelancer_signature_type = request.data.get('freelancer_signature_type')
                contract.freelancer_ip = request.META.get('REMOTE_ADDR')
                contract.freelancer_signed_at = timezone.now()
                contract.status = 'active'
                contract.save()
                
                pdf_url = generate_contract_pdf(contract)
                if pdf_url:
                    contract.legal_document = pdf_url
                    contract.save()

                project = contract.project
                project.status = 'in_progress'
                project.save()
                
                Proposal.objects.filter(
                    project=project, 
                    freelancer__user=contract.freelancer
                ).update(status='accepted')

                Proposal.objects.filter(
                    project=project
                ).exclude(
                    freelancer__user=contract.freelancer
                ).update(status='rejected')

                logger.info(f"Contract {contract.id} accepted. Project {project.id} in_progress.")
                return Response({"status": "Contract is now active!", "pdf_url": pdf_url})
            
            return Response(serializer.errors, status=400)
        except ObjectDoesNotExist:
            return Response({"error": "Contract not found."}, status=404)
        except Exception as e:
            logger.error(f"Error in accept action: {str(e)}")
            return Response({"error": "An internal error occurred."}, status=500)

    @action(detail=True, methods=['patch'])
    def status_update(self, request, pk=None):
        try:
            contract = self.get_object()
            new_status = request.data.get('status')
            
            if new_status == 'completed' and contract.client == request.user:
                if contract.status != 'submitted':
                    return Response({"error": "Work must be submitted before completion."}, status=400)
                    
                contract.status = 'completed'
                contract.completed_at = timezone.now()
                contract.save()

                project = contract.project
                project.status = 'completed'
                project.save()

                return Response({"message": "Order approved and marked as completed."})
            
            return Response({"error": "Invalid action or unauthorized user."}, status=400)
        except ObjectDoesNotExist:
            return Response({"error": "Contract not found."}, status=404)
        except Exception as e:
            logger.error(f"Error in status_update: {str(e)}")
            return Response({"error": "An internal error occurred."}, status=500)

class SubmitDeliverableView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id)
            
            if contract.freelancer != request.user:
                return Response({"error": "Unauthorized."}, status=status.HTTP_403_FORBIDDEN)

            if contract.status not in ['active', 'submitted']:
                return Response({"error": "Contract not active."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ContractDeliverableSerializer(data=request.data, context={'request': request})
            if serializer.is_valid():
                serializer.save(freelancer=request.user, contract=contract)
                contract.status = 'submitted'
                contract.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found."}, status=404)
        except Exception as e:
            logger.error(f"Error in SubmitDeliverableView: {str(e)}")
            return Response({"error": "Internal error occurred"}, status=500)

class RequestRevisionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, contract_id):
        try:
            contract = Contract.objects.get(id=contract_id, client=request.user)
            
            if contract.status != 'submitted':
                return Response({"error": "Only for submitted work."}, status=400)

            reason = request.data.get('reason')
            if not reason or len(reason) < 10:
                return Response({"error": "Valid reason required."}, status=400)

            ContractRevision.objects.create(
                contract=contract,
                requested_by=request.user,
                reason=reason,
                status='pending'
            )
            return Response({"message": "Revision requested."})
        except Contract.DoesNotExist:
            return Response({"error": "Contract not found."}, status=404)
        except Exception as e:
            logger.error(f"Error in RequestRevisionView: {str(e)}")
            return Response({"error": "Internal error occurred"}, status=500)

class FreelancerRevisionActionView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, revision_id):
        try:
            revision = ContractRevision.objects.get(id=revision_id, contract__freelancer=request.user)
            action = request.data.get('action')
            
            if action == 'accept':
                revision.status = 'accepted'
                revision.contract.status = 'active'
                revision.contract.save()
                revision.save()
                return Response({"message": "Revision accepted."})
                
            elif action == 'reject':
                message = request.data.get('message')
                if not message:
                    return Response({"error": "Reason required."}, status=400)
                revision.status = 'rejected'
                revision.rejection_message = message
                revision.save()
                return Response({"message": "Revision rejected."})
            
            return Response({"error": "Invalid action."}, status=400)
        except ContractRevision.DoesNotExist:
            return Response({"error": "Revision not found."}, status=404)
        except Exception as e:
            logger.error(f"Error in FreelancerRevisionActionView: {str(e)}")
            return Response({"error": "Internal error occurred"}, status=500)
        


class RaiseDisputeView(APIView):
    permission_classes = [IsClientUser | IsFreelancerUser]

    def post(self, request):
        serializer = DisputeSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid():
            dispute = serializer.save()
            return Response({
                "message": "Dispute raised successfully", 
                "id": dispute.id
            }, status=201)
        
        return Response(serializer.errors, status=400)
    
class AdminDisputeViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAdminUser]
    
    def get_queryset(self):
        return Dispute.objects.select_related(
            'contract', 'contract__client', 'contract__freelancer', 'contract__project',
            'opened_by_client__user', 'opened_by_freelancer__user'
        ).prefetch_related('evidence', 'contract__deliverables', 'contract__revisions').all().order_by('-created_at')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return AdminDisputeDetailSerializer
        return AdminDisputeListSerializer

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        dispute = self.get_object()
        if dispute.status != 'pending':
            return Response(
                {"error": f"This case is already {dispute.status} and cannot be modified."}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        new_status = request.data.get('status')
        admin_notes = request.data.get('admin_notes')
        contract_status = request.data.get('contract_status') 

        valid_statuses = [choice[0] for choice in Dispute.STATUS_CHOICES]
        if new_status not in valid_statuses:
            return Response({"error": "Invalid dispute status"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                dispute.status = new_status
                dispute.admin_notes = admin_notes
                if new_status == 'resolved':
                    dispute.resolved_at = timezone.now()
                
                if contract_status:
                    dispute.contract.status = contract_status
                    dispute.contract.save()
                
                dispute.save()

            return Response({
                "message": "Dispute updated successfully",
                "current_dispute_status": dispute.status,
                "current_contract_status": dispute.contract.status
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)