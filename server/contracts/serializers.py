from rest_framework import serializers
from .models import Contract, ContractDeliverable, ContractRevision
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
    project_category = serializers.CharField(source='project.category.name', read_only=True)
    profile_photo = serializers.URLField(source="client.profile_photo", read_only=True)
    skills = serializers.SerializerMethodField()
    package_name = serializers.CharField(source='package.package_type', read_only=True)
    delivery_days = serializers.IntegerField(source='package.delivery_days', read_only=True)
    freelancer_name = serializers.CharField(source='freelancer.full_name', read_only=True)
    deliverables = ContractDeliverableSerializer(many=True, read_only=True)
    revisions = ContractRevisionSerializer(many=True, read_only=True)

    class Meta:
        model = Contract
        fields = [
            'id', 'project_title', 'project_description', 'project_category', 'project_id',
            'client_name', 'freelancer_name', 'total_amount', 'status', 'freelancer_signed_at',
            'skills', 'profile_photo', 'package_name', 'delivery_days', 'deliverables', 'revisions'
        ]

    def get_skills(self, obj):
        skills_queryset = obj.project.project_skills.all()
        return [
            item.skill.name if item.skill else item.custom_name 
            for item in skills_queryset
        ]

class ContractOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['project', 'freelancer', 'total_amount', 'client_signature', 'client_signature_type']

class ContractAcceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['freelancer_signature', 'freelancer_signature_type']