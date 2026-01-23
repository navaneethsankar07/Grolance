from rest_framework import serializers
from .models import Payment

class PaymentVerificationSerializer(serializers.Serializer):
    paypal_order_id = serializers.CharField()
    project_id = serializers.IntegerField()
    freelancer_id = serializers.IntegerField()
    total_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    client_signature = serializers.CharField(required=False, allow_blank=True)
    client_signature_type = serializers.CharField(required=False)