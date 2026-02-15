from rest_framework import serializers
from .models import (
    ClientProfile, FreelancerProfile, FreelancerPaymentSettings, 
    FreelancerPortfolio, FreelancerPackage, FreelancerSkill, Review,FreelancerToDo
)
from categories.models import Category
import re

class ClientProfileOverviewSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    email = serializers.EmailField(source="user.email", read_only=True)
    profile_photo = serializers.URLField(source="user.profile_photo", read_only=True)
    joined_at = serializers.DateTimeField(source="user.created_at", read_only=True)
    is_google_account = serializers.BooleanField(source="user.is_google_account", read_only=True)
    categories = serializers.StringRelatedField(many=True)

    class Meta:
        model = ClientProfile
        fields = [
           "id", "full_name", "email", "profile_photo", "company_name",
            "location", "categories", "joined_at", "is_google_account",'review_count','average_rating'
        ]

class ClientProfileUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False)
    profile_photo = serializers.URLField(required=False, allow_null=True)
    categories = serializers.PrimaryKeyRelatedField(
        many=True, 
        queryset=Category.objects.all(), 
        required=False
    )

    class Meta:
        model = ClientProfile
        fields = ["company_name", "location", "categories", "full_name", "profile_photo"]

    def update(self, instance, validated_data):
        full_name = validated_data.pop("full_name", None)
        profile_photo = validated_data.pop("profile_photo", None)
        categories = validated_data.pop("categories", None)

        user = instance.user
        if full_name is not None:
            user.full_name = full_name
        if profile_photo is not None:
            user.profile_photo = profile_photo
        
        if full_name or profile_photo:
            user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if categories is not None:
            instance.categories.set(categories)

        instance.save()
        return instance

class FreelancerProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerProfile
        fields = [
            'id', 'tagline', 'bio', 'phone', 
            'is_phone_verified', 'category', 
            'experience_level', 'availability','average_rating','review_count'
        ]

class FreelancerSkillSerializer(serializers.Serializer):
    name = serializers.CharField()

    def validate(self, value):
        return value.strip().title()

class FreelancerPackageSerializer(serializers.Serializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    delivery_days = serializers.IntegerField(min_value=1, max_value=100)
    description = serializers.CharField()

class FreelancerPortfolioSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    image_url = serializers.URLField()

class FreelancerPaymentSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerPaymentSettings
        fields = ["paypal_email", "is_verified"]

class PackageTierSerializer(serializers.Serializer):
    price = serializers.IntegerField(min_value=100, max_value=500000)
    deliveryTime = serializers.IntegerField(min_value=1, max_value=100)
    description = serializers.CharField(min_length=20, max_length=400)

class PortfolioItemSerializer(serializers.Serializer):
    title = serializers.CharField(min_length=10, max_length=50)
    description = serializers.CharField(min_length=10, max_length=300)
    image_url = serializers.URLField(required=True) 

class PaymentDetailsSerializer(serializers.Serializer):
    paypalEmail = serializers.EmailField()

class FreelancerOnboardingSerializer(serializers.Serializer):
    tagline = serializers.CharField(min_length=10, max_length=80)
    bio = serializers.CharField(min_length=50, max_length=500)
    phone = serializers.CharField(max_length=10)
    experience_level = serializers.ChoiceField(choices=["beginner", "intermediate", "expert"])
    primary_category = serializers.IntegerField()
    skills = serializers.ListField(child=serializers.CharField(min_length=2), min_length=3, max_length=15)
    packages = serializers.DictField() 
    portfolios = serializers.ListField(child=PortfolioItemSerializer(), min_length=1, max_length=3)
    payment_details = PaymentDetailsSerializer()

    def validate_phone(self, value):
        if not re.match(r'^[6-9]\d{9}$', value):
            raise serializers.ValidationError("Enter a valid 10-digit Indian mobile number starting with 6-9")
        return value

    def validate_skills(self, value):
        for skill in value:
            if skill.isdigit():
                raise serializers.ValidationError(f"Skill '{skill}' cannot be only numbers")
        return value

    def validate_packages(self, value):
        if 'starter' not in value or 'pro' not in value:
            raise serializers.ValidationError("Both starter and pro packages are required")
        for tier in ['starter', 'pro']:
            serializer = PackageTierSerializer(data=value[tier])
            if not serializer.is_valid():
                raise serializers.ValidationError({tier: serializer.errors})
        return value

class SendPhoneOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=10)

    def validate_phone(self, phone):
        if not phone.isdigit() or len(phone) != 10:
            raise serializers.ValidationError("Enter a valid 10-digit mobile number")
        user = self.context['request'].user
        already_verified = FreelancerProfile.objects.filter(phone=phone, is_phone_verified=True).exclude(user=user).exists()
        if already_verified:
            raise serializers.ValidationError("This phone number is already verified by another account")
        return phone
    
class VerifyPhoneOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=10)
    otp = serializers.CharField(max_length=6)

    def validate_phone(self, phone):
        if not phone.isdigit() or len(phone) != 10:
            raise serializers.ValidationError("Invalid phone number")
        return phone
    
class RoleSwitchSerializer(serializers.Serializer):
    role = serializers.ChoiceField(choices=["client", "freelancer"])

class FreelancerProfileManageSerializer(serializers.ModelSerializer):
    skills = serializers.SerializerMethodField()
    packages = serializers.SerializerMethodField()
    portfolios = serializers.SerializerMethodField()
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    profile_photo = serializers.URLField(source="user.profile_photo", read_only=True)
    category = serializers.StringRelatedField()
    payment_settings = serializers.SerializerMethodField()
    completed_projects_count = serializers.SerializerMethodField()
    reviews = serializers.SerializerMethodField()
    
    class Meta:
        model = FreelancerProfile
        fields = [
            'full_name', 'profile_photo', 'tagline', 'bio', 'phone', 
            'category', 'experience_level', 'availability', 
            'skills', 'packages', 'portfolios', 'payment_settings', 'created_at','completed_projects_count','review_count','average_rating','reviews'
        ]

    def get_skills(self, obj):
        return [s.custom_name for s in obj.user.freelancer_skills.all()]
    
    def get_completed_projects_count(self, obj):
        from contracts.models import Contract  
        return Contract.objects.filter(
            freelancer=obj.user, 
            status='completed'
        ).count()
    
    def get_reviews(self, obj):
        reviews = Review.objects.filter(
            reviewee=obj.user, 
            review_type='freelancer'
        ).order_by('-created_at')[:10]

        return [{
            "id": review.id,
            "rating": review.rating,
            "comment": review.comment,
            "created_at": review.created_at,
            "reviewer_name": review.reviewer.full_name,
            "reviewer_photo": review.reviewer.profile_photo if review.reviewer.profile_photo else None,
            "project_title": review.contract.project.title if review.contract else "Project"
        } for review in reviews]

    def get_packages(self, obj):
        packages = obj.user.freelancer_packages.all()
        return {pkg.package_type: {
            "id": pkg.id,
            "price": pkg.price,
            "delivery_days": pkg.delivery_days,
            "description": [item.strip() for item in pkg.description.split('\n') if item.strip()]
        } for pkg in packages}

    def get_portfolios(self, obj):
        return FreelancerPortfolioSerializer(obj.user.freelancer_portfolios.all(), many=True).data
    
    def get_payment_settings(self, obj):
        try:
            settings = obj.user.payment_settings
            return FreelancerPaymentSettingsSerializer(settings).data
        except FreelancerPaymentSettings.DoesNotExist:
            return None

class FreelancerProfileUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False)
    profile_photo = serializers.URLField(required=False, allow_null=True)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    packages = serializers.DictField(required=False)
    portfolios = serializers.ListField(required=False)
    payment_settings = serializers.DictField(required=False)

    class Meta:
        model = FreelancerProfile
        fields = [
            "tagline", "bio", "experience_level", 
            "availability", "full_name", "profile_photo",
            "skills", "packages", "portfolios", 'payment_settings'
        ]

    def update(self, instance, validated_data):
        user = instance.user
        if "full_name" in validated_data:
            user.full_name = validated_data.pop("full_name")
        if "profile_photo" in validated_data:
            user.profile_photo = validated_data.pop("profile_photo")
        user.save()

        skills_data = validated_data.pop("skills", None)
        packages_data = validated_data.pop("packages", None)
        portfolios_data = validated_data.pop("portfolios", None)
        payment_data = validated_data.pop("payment_settings", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if skills_data is not None:
            user.freelancer_skills.all().delete()
            for skill_name in skills_data:
                FreelancerSkill.objects.create(user=user, custom_name=skill_name)

        if packages_data is not None:
            user.freelancer_packages.all().delete()
            for pkg_type, pkg in packages_data.items():
                delivery_days = pkg.get("delivery_days") or pkg.get("deliveryTime") or 1
                description = pkg.get("description", "")
                if isinstance(description, list):
                    description = "\n".join(description)
                FreelancerPackage.objects.create(
                    user=user, package_type=pkg_type, price=pkg.get("price", 0),
                    delivery_days=delivery_days, description=description
                )

        if portfolios_data is not None:
            user.freelancer_portfolios.all().delete()
            for item in portfolios_data:
                FreelancerPortfolio.objects.create(
                    user=user, title=item.get('title', 'Untitled'),
                    description=item.get('description', ''), image_url=item.get('image_url')
                )
        
        if payment_data is not None:
            FreelancerPaymentSettings.objects.update_or_create(
                user=user,
                defaults={"paypal_email": payment_data.get("paypal_email")}
            )
        return instance

class FreelancerListingSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    profile_photo = serializers.URLField(source="user.profile_photo", read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)
    skills = serializers.SerializerMethodField()
    starting_price = serializers.SerializerMethodField()

    class Meta:
        model = FreelancerProfile
        fields = [
            'id', 'full_name', 'profile_photo', 'tagline','bio',
            'category_name', 'experience_level', 'skills', 
            'starting_price', 'availability','average_rating','review_count'
        ]

    def get_skills(self, obj):
        return list(obj.user.freelancer_skills.values_list('custom_name', flat=True)[:3])

    def get_starting_price(self, obj):
        prices = obj.user.freelancer_packages.values_list('price', flat=True)
        return min(prices) if prices else 0
    

class ReviewSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.ReadOnlyField(source='reviewer.full_name')
    reviewer_photo = serializers.ReadOnlyField(source='reviewer.profile_photo')

    class Meta:
        model = Review
        fields = [
            'id', 'reviewer', 'reviewer_name', 'reviewer_photo', 
            'reviewee', 'review_type', 'rating', 'comment', 
            'contract', 'created_at'
        ]
        read_only_fields = ['reviewer', 'created_at']

    def validate(self, data):
        if self.context['request'].user == data['reviewee']:
            raise serializers.ValidationError("You cannot review yourself.")
        return data

class FreelancerReviewListSerializer(serializers.ModelSerializer):
    reviewer_name = serializers.CharField(source="reviewer.full_name", read_only=True)
    reviewer_photo = serializers.URLField(source="reviewer.profile_photo", read_only=True)
    project_title = serializers.CharField(source="contract.project.title", read_only=True)

    class Meta:
        model = Review
        fields = [
            'id', 'rating', 'comment', 'created_at',
            'reviewer_name', 'reviewer_photo', 'project_title'
        ]


class FreelancerToDoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerToDo
        fields = ['id', 'todo', 'is_completed']
        read_only_fields = ['id']