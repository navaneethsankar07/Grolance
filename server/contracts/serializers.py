from rest_framework import serializers
from .models import Contract

class ContractSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(source='project.title', read_only=True)
    project_description = serializers.CharField(source='project.description', read_only=True)
    client_name = serializers.CharField(source='client.full_name', read_only=True)
    project_category = serializers.CharField(source='project.category.name', read_only=True)
    
    skills = serializers.SerializerMethodField()

    class Meta:
        model = Contract
        fields = [
            'id', 'project_title', 'project_description', 'project_category',
            'client_name', 'total_amount', 'status', 'freelancer_signed_at',
            'skills'
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