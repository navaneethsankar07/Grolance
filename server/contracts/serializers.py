from rest_framework import serializers
from .models import Contract

class ContractSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = '__all__'
        read_only_fields = ('status', 'is_funded', 'paid_to_freelancer', 'client_signed_at', 'freelancer_signed_at')

class ContractOfferSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['project', 'freelancer', 'total_amount', 'client_signature', 'client_signature_type']

class ContractAcceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contract
        fields = ['freelancer_signature', 'freelancer_signature_type']