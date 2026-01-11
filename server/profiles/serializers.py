from rest_framework import serializers
from .models import ClientProfile
from categories.models import Category
from .models import FreelancerProfile,FreelancerBankDetails,FreelancerPortfolio, FreelancerPackage, FreelancerSkill


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
            "full_name",
            "email",
            "profile_photo",
            "company_name",
            "location",
            "categories",
            "joined_at",
            "is_google_account"
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
            'tagline',
            'bio',
            'phone',
            'is_phone_verified',
            'category',
            'experience_level',
            'availability',
        ]

class FreelancerSkillSerializer(serializers.Serializer):
    name = serializers.CharField()

    def validate(self,value):
        return value.strip().title()
    


class FreelancerPackageSerializer(serializers.Serializer):
    price = serializers.DecimalField(max_digits=10, decimal_places=2)
    delivery_days = serializers.IntegerField(min_value=1, max_value=100)
    description = serializers.CharField()

class FreelancerPortfolioSerializer(serializers.Serializer):
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    image_url = serializers.URLField()


class FreelancerBankDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FreelancerBankDetails
        fields = [
            "account_number",
            "ifsc",
            "account_holder_name",
            "bank_name",
            "branch_name",
        ]

class FreelancerOnboardingSerializer(serializers.Serializer):
    tagline = serializers.CharField()
    bio = serializers.CharField()
    phone = serializers.CharField(max_length=10)

    primary_category = serializers.IntegerField()
    skills = serializers.ListField(child=serializers.CharField())

    experience_level = serializers.ChoiceField(
        choices=["beginner", "intermediate", "expert"]
    )

    packages = serializers.DictField()
    portfolios = serializers.ListField(required=False)
    bank_details = serializers.DictField()

    def validate_phone(self, value):
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Invalid Indian mobile number")
        return value


class SendPhoneOTPSerializer(serializers.Serializer):
    phone = serializers.CharField(max_length=10)

    def validate_phone(self, phone):
        if not phone.isdigit() or len(phone) != 10:
            raise serializers.ValidationError("Enter a valid 10-digit mobile number")
        user = self.context['request'].user
        already_verified = FreelancerProfile.objects.filter(
            phone=phone, 
            is_phone_verified=True
        ).exclude(user=user).exists()

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
    
    class Meta:
        model = FreelancerProfile
        fields = [
            'full_name', 'profile_photo', 'tagline', 'bio', 'phone', 
            'category', 'experience_level', 'availability', 
            'skills', 'packages', 'portfolios','created_at',
        ]

    def get_skills(self, obj):
        skills = obj.user.freelancer_skills.all()
        return [s.custom_name for s in skills]

    def get_packages(self, obj):
        packages = obj.user.freelancer_packages.all()
        return {pkg.package_type: {
            "price": pkg.price,
            "delivery_days": pkg.delivery_days,
            "description": [item.strip() for item in pkg.description.split('\n') if item.strip()]
        } for pkg in packages}

    def get_portfolios(self, obj):
        portfolios = obj.user.freelancer_portfolios.all()
        return FreelancerPortfolioSerializer(portfolios, many=True).data
    


class FreelancerProfileUpdateSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(required=False)
    profile_photo = serializers.URLField(required=False, allow_null=True)
    skills = serializers.ListField(child=serializers.CharField(), required=False)
    packages = serializers.DictField(required=False)
    portfolios = serializers.ListField(required=False)

    class Meta:
        model = FreelancerProfile
        fields = [
            "tagline", "bio", "experience_level", 
            "availability", "full_name", "profile_photo",
            "skills", "packages", "portfolios"
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
                    user=user,
                    package_type=pkg_type,
                    price=pkg.get("price", 0),
                    delivery_days=delivery_days,
                    description=description
                )

        if portfolios_data is not None:
            user.freelancer_portfolios.all().delete()
            for item in portfolios_data:
                FreelancerPortfolio.objects.create(
                    user=user,
                    title=item.get('title', 'Untitled'),
                    description=item.get('description', ''),
                    image_url=item.get('image_url')
                )

        return instance