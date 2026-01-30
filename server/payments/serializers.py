from rest_framework import serializers
from .models import Payment
from contracts.serializers import ContractListSerializer

class PaymentVerificationSerializer(serializers.Serializer):
    paypal_order_id = serializers.CharField()
    project_id = serializers.IntegerField()
    freelancer_id = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    client_signature = serializers.CharField(required=False, allow_blank=True)
    client_signature_type = serializers.CharField(required=False)


class ReleasePaymentSerializer(serializers.Serializer):
    contract_id = serializers.IntegerField()
    platform_paypal_email = serializers.EmailField()

class ClientDashboardSerializer(serializers.Serializer):
    total_spent = serializers.DecimalField(max_digits=10,decimal_places=2)
    projects_completed = serializers.IntegerField()
    ongoing_projects = serializers.IntegerField()
    avg_per_project = serializers.DecimalField(max_digits=10, decimal_places=2)

    recent_projects = ContractListSerializer(many=True)

class FreelancerTransactionSerializer(serializers.Serializer):
    total_earning = serializers.DecimalField(max_digits=10,decimal_places=2)
    total_projects = serializers.IntegerField()
    contracts = ContractListSerializer(many=True)


class AdminTransactionSerializer(serializers.ModelSerializer):
    client_name = serializers.CharField(source='contract.client.full_name',read_only=True)
    freelancer_name = serializers.CharField(source='contract.freelancer.full_name',read_only=True)
    payment_id = serializers.CharField(source='paypal_order_id', read_only=True)
    date = serializers.DateTimeField(source='created_at', format="%d-%m-%Y", read_only=True)
    
    class Meta:
        model = Payment
        fields = ['id','payment_id','client_name','freelancer_name', 'amount_total' , 'platform_fee', 'date','status']