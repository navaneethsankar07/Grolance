from rest_framework import viewsets, status, permissions
from rest_framework.views import APIView
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from .models import Contract, ContractRevision
from .serializers import ContractSerializer, ContractOfferSerializer, ContractAcceptSerializer, ContractDeliverableSerializer
import logging
from .utils import generate_contract_pdf
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
            ).prefetch_related('deliverables', 'revisions')
            
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