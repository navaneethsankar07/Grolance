from rest_framework import serializers
from .models import Contract, ContractDeliverable, ContractRevision, Dispute, DisputeFile
import cloudinary.uploader
from django.conf import settings

class ContractDeliverableSerializer(serializers.ModelSerializer):
    file = serializers.FileField(required=False, write_only=True)
    link_url = serializers.URLField(required=False, write_only=True)

    class Meta:
        model = ContractDeliverable
        fields = [
            'id', 'contract', 'freelancer', 'title', 'file_url', 
            'deliverable_type', 'notes', 'created_at', 'file', 'link_url'
        ]
        read_only_fields = ['id', 'freelancer', 'contract', 'file_url', 'created_at']

    def validate_title(self, value):
        if len(value) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters long.")
        return value

    def validate(self, data):
        deliverable_type = data.get('deliverable_type')
        if deliverable_type == 'file':
            if not self.context['request'].FILES.get('file'):
                raise serializers.ValidationError({"file": "File is required for 'file' type submissions."})
            file_obj = self.context['request'].FILES.get('file')
            if file_obj.size > 50 * 1024 * 1024:
                raise serializers.ValidationError({"file": "File size cannot exceed 50MB."})
        elif deliverable_type == 'link':
            if not data.get('link_url'):
                raise serializers.ValidationError({"link_url": "URL is required for 'link' type submissions."})
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        deliverable_type = validated_data.get('deliverable_type')
        if deliverable_type == 'file':
            file_to_upload = request.FILES.get('file')
            try:
                upload_result = cloudinary.uploader.upload(
                    file_to_upload,
                    resource_type="auto",
                    folder="contracts/deliverables/",
                    unsigned=True,
                    upload_preset=settings.CLOUDINARY_UPLOAD_PRESET,
                    cloud_name=settings.CLOUDINARY_STORAGE['CLOUD_NAME'],
                    tags=["contract_deliverable", f"contract_{validated_data.get('contract').id}"]
                )
                validated_data['file_url'] = upload_result['secure_url']
            except Exception as e:
                raise serializers.ValidationError({"file": f"Upload Error: {str(e)}"})
        else:
            validated_data['file_url'] = validated_data.pop('link_url', None)
        validated_data.pop('file', None)
        validated_data.pop('link_url', None)
        return super().create(validated_data)

class ContractRevisionSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContractRevision
        fields = ['id', 'reason', 'status', 'rejection_message', 'created_at']

class ContractSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_id = serializers.CharField(source='project.id', read_only=True)
    project_description = serializers.CharField(source='project.description', read_only=True)
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    client_id = serializers.CharField(source='client.id', read_only=True)
    project_category = serializers.CharField(source='project.category.name', read_only=True)
    profile_photo = serializers.URLField(source="client.profile_photo", read_only=True)
    skills = serializers.SerializerMethodField()
    package_name = serializers.CharField(source='package.package_type', read_only=True)
    delivery_days = serializers.IntegerField(source='package.delivery_days', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.full_name', read_only=True)
    freelancer_id = serializers.CharField(source='freelancer.id', read_only=True)
    deliverables = ContractDeliverableSerializer(many=True, read_only=True)
    revisions = ContractRevisionSerializer(many=True, read_only=True)
    legal_document_url = serializers.SerializerMethodField()
    dispute_details = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = [
            'id', 'project_title', 'project_description', 'project_category', 'project_id',
            'client_name', 'freelancer_name', 'total_amount', 'status', 'freelancer_signed_at',
            'skills', 'profile_photo', 'package_name', 'delivery_days', 'deliverables', 'revisions',
            'legal_document_url', 'client_signature', 'freelancer_signature', 
            'client_signed_at', 'client_ip', 'freelancer_ip','freelancer_id','client_id','dispute_details'
        ]

    def get_skills(self, obj):
        skills_queryset = obj.project.project_skills.all()
        return [
            item.skill.name if item.skill else item.custom_name 
            for item in skills_queryset
        ]
    def get_legal_document_url(self, obj):
        if obj.legal_document:
            return obj.legal_document.url
        return None

    def get_dispute_details(self, obj):
        dispute = getattr(obj, 'dispute', None) 
        
        if not dispute and hasattr(obj, 'disputes'):
            dispute = obj.disputes.order_by('-created_at').first()

        if dispute:
            return {
                "id": dispute.id,
                "status": dispute.status,
                "reason": dispute.reason,
                "admin_notes": dispute.admin_notes,
                "created_at": dispute.created_at,
                "resolved_at": dispute.resolved_at
            }
        return None

class ContractOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['project', 'freelancer', 'total_amount', 'client_signature', 'client_signature_type']

class ContractAcceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['freelancer_signature', 'freelancer_signature_type']

class ContractListSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.user.full_name', read_only=True)
    freelancer_earnings = serializers.SerializerMethodField()
    class Meta:
        model = Contract
        fields = ['id', 'project_title','freelancer_name', 'status' ,'total_amount', 'client_signed_at' , 'freelancer_earnings']

    
    def get_freelancer_earnings(self, obj):
        try:
            return obj.escrow_details.freelancer_share
        except AttributeError:
            return 0.00
        

from django.db import transaction

class DisputeSerializer(serializers.ModelSerializer):
    contract = serializers.PrimaryKeyRelatedField(queryset=Contract.objects.all())
    evidence_urls = serializers.ListField(child=serializers.URLField(), write_only=True, required=False)

    class Meta:
        model = Dispute
        fields = ['contract', 'reason', 'description', 'evidence_urls']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        contract = validated_data['contract']
        evidence_urls = validated_data.pop('evidence_urls', [])

        if contract.status == 'disputed' or Dispute.objects.filter(contract=contract).exists():
            raise serializers.ValidationError({"detail": "A dispute has already been raised for this contract."})

        opened_by_client = None
        opened_by_freelancer = None

        if user.current_role == 'client':
            if user != contract.client:
                raise serializers.ValidationError("You are not the client on this contract")
            opened_by_client = user.client_profile
        else:
            if user != contract.freelancer:
                raise serializers.ValidationError("You are not the freelancer on this contract")
            opened_by_freelancer = user.freelancer_profile

        with transaction.atomic():
            dispute = Dispute.objects.create(
                opened_by_client=opened_by_client,
                opened_by_freelancer=opened_by_freelancer,
                **validated_data
            )

            for url in evidence_urls:
                DisputeFile.objects.create(dispute=dispute, file_url=url)

            contract.status = 'disputed'
            contract.save()

        return dispute
    

class AdminDisputeListSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='contract.client.full_name', read_only=True)
    freelancer_name = serializers.CharField(source='contract.freelancer.full_name', read_only=True)
    
    opened_by = serializers.SerializerMethodField()

    class Meta:
        model = Dispute
        fields = [
            'id', 
            'contract', 
            'reason', 
            'status', 
            'client_name', 
            'freelancer_name', 
            'opened_by',
            'created_at'
        ]

    def get_opened_by(self, obj):
        if obj.opened_by_client:
            return "Client"
        return "Freelancer"

class AdminDisputeDetailSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='opened_by_client.user.full_name', read_only=True)
    freelancer_name = serializers.CharField(source='opened_by_freelancer.user.full_name', read_only=True)
    evidence_files = serializers.SerializerMethodField()
    contract_details = ContractSerializer(source='contract', read_only=True)

    class Meta:
        model = Dispute
        fields = [
            'id', 'status', 'reason', 'description', 'client_name', 
            'freelancer_name', 'admin_notes', 'created_at', 'resolved_at',
            'evidence_files', 'contract_details'
        ]

    def get_evidence_files(self, obj):
        return obj.evidence.values_list('file_url', flat=True)
    