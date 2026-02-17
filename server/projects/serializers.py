from rest_framework import serializers
from .models import Project, ProjectSkill, Invitation, Proposal
from categories.models import Skill
from profiles.models import ClientProfile, FreelancerProfile, FreelancerPackage
from contracts.models import Contract
from django.core.exceptions import ObjectDoesNotExist

class ProjectCreateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        write_only=True,
        min_length=1
    )

    class Meta:
        model = Project
        fields = [
            "title",
            "description",
            "requirements",
            "expected_deliverables",
            "category",
            "pricing_type",
            "fixed_price",
            "min_budget",
            "max_budget",
            "delivery_days",
            "skills",
        ]

    def validate(self, attrs):
        pricing_type = attrs.get("pricing_type")

        fixed_price = attrs.get("fixed_price")
        min_budget = attrs.get("min_budget")
        max_budget = attrs.get("max_budget")

        if pricing_type == "fixed":
            if fixed_price is None:
                raise serializers.ValidationError({
                    "fixed_price": "Fixed price is required for fixed pricing."
                })
            if min_budget or max_budget:
                raise serializers.ValidationError(
                    "Range budgets are not allowed for fixed price projects."
                )

        if pricing_type == "range":
            if min_budget is None or max_budget is None:
                raise serializers.ValidationError(
                    "Both min and max budget are required for range pricing."
                )
            if min_budget >= max_budget:
                raise serializers.ValidationError(
                    "Minimum budget must be less than maximum budget."
                )
            if fixed_price:
                raise serializers.ValidationError(
                    "Fixed price is not allowed for range pricing."
                )

        return attrs

    def validate_category(self, value):
        if not value:
            raise serializers.ValidationError("Category is required")
        return value

    def create(self, validated_data):
        skills_data = validated_data.pop("skills")
        user = self.context["request"].user

        project = Project.objects.create(
            client=user,
            **validated_data
        )

        for skill_name in skills_data:
            normalized = skill_name.strip().title()

            skill = Skill.objects.filter(
                name__iexact=normalized).first()

            if skill:
                ProjectSkill.objects.create(
                    project=project,
                    skill=skill,
                    custom_name=None
                )
            else:
                ProjectSkill.objects.create(
                    project=project,
                    skill=None,
                    custom_name=normalized
                )

        return project


class ProjectListSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(
        source="category.name",
        read_only=True
    )
    category = serializers.PrimaryKeyRelatedField(
        source='category.id', 
        read_only=True
    )
    skills = serializers.SerializerMethodField()
    contract_id = serializers.SerializerMethodField()
    proposals_count = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'category_name',
            'pricing_type', 'fixed_price', 'min_budget',
            'max_budget', 'delivery_days', 'status',
            'created_at', 'skills', 'contract_id', 'proposals_count','category'
        ]

    def get_skills(self, obj):
        skills = []
        for ps in obj.project_skills.all():
            if ps.skill_id:
                skills.append(ps.skill.name)
            elif ps.custom_name:
                skills.append(ps.custom_name)
        return skills

    def get_contract_id(self, obj):
        try:
            return obj.contract.id
        except Exception:
            return None

    def get_proposals_count(self, obj):
        return obj.proposals.count()


class ProjectUpdateSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(
        child=serializers.CharField(),
        required=False,
        write_only=True
    )
    skills_display = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Project
        fields = [
            "title",
            "description",
            "requirements",
            "expected_deliverables",
            "category",
            "pricing_type",
            "fixed_price",
            "min_budget",
            "max_budget",
            "delivery_days",
            "status",
            "skills",
            "skills_display"
        ]

    def get_skills_display(self, obj):
        skills = []
        for ps in obj.project_skills.all():
            if ps.skill:
                skills.append(ps.skill.name)
            else:
                skills.append(ps.custom_name)
        return skills

    def validate(self, attrs):
        pricing_type = attrs.get("pricing_type", self.instance.pricing_type)

        fixed_price = attrs.get("fixed_price", self.instance.fixed_price)
        min_budget = attrs.get("min_budget", self.instance.min_budget)
        max_budget = attrs.get("max_budget", self.instance.max_budget)

        if pricing_type == "fixed":
            if fixed_price is None:
                raise serializers.ValidationError({
                    "fixed_price": "Fixed price is required."
                })
            if min_budget or max_budget:
                raise serializers.ValidationError(
                    "Range budget not allowed for fixed pricing."
                )

        if pricing_type == "range":
            if min_budget is None or max_budget is None:
                raise serializers.ValidationError(
                    "Both min and max budget are required."
                )
            if min_budget >= max_budget:
                raise serializers.ValidationError(
                    "Minimum budget must be less than maximum budget."
                )
            if fixed_price:
                raise serializers.ValidationError(
                    "Fixed price not allowed for range pricing."
                )

        return attrs

    def update(self, instance, validated_data):
        skills_data = validated_data.pop("skills", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()

        if skills_data is not None:
            instance.project_skills.all().delete()

            for skill_name in skills_data:
                normalized = skill_name.strip().title()

                skill = Skill.objects.filter(name__iexact=normalized).first()

                ProjectSkill.objects.create(
                    project=instance,
                    skill=skill if skill else None,
                    custom_name=None if skill else normalized,
                )

        return instance


class RecommendedProjectSerializer(serializers.ModelSerializer):
    category = serializers.CharField(source="category.name")
    skills = serializers.SerializerMethodField()
    budget = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "description",
            "category",
            "budget",
            "delivery_days",
            "skills",
            "created_at",
        ]

    def get_skills(self, obj):
        return [
            ps.skill.name if ps.skill else ps.custom_name
            for ps in obj.project_skills.all()
        ]

    def get_budget(self, obj):
        if obj.pricing_type == "fixed":
            return str(obj.fixed_price)
        return f"{obj.min_budget} - {obj.max_budget}"


class ProjectClientSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", read_only=True)
    profile_photo = serializers.URLField(
        source="user.profile_photo", read_only=True)
    member_since = serializers.SerializerMethodField()
    total_jobs_posted = serializers.SerializerMethodField()
    contract_id = serializers.SerializerMethodField()

    class Meta:
        model = ClientProfile
        fields = ["full_name", "profile_photo",
                  "member_since", "total_jobs_posted", 'contract_id' ,'average_rating','review_count']

    def get_member_since(self, obj):
        return obj.user.created_at.strftime("%b %Y")

    def get_total_jobs_posted(self, obj):
        return Project.objects.filter(client=obj.user).count()

    def get_contract_id(self, obj):
        try:
            return obj.contract.id
        except Exception:
            return None


class ProjectDetailSerializer(ProjectListSerializer):
    requirements = serializers.CharField()
    expected_deliverables = serializers.CharField()
    client_info = serializers.SerializerMethodField()
    is_applied = serializers.SerializerMethodField()
    class Meta(ProjectListSerializer.Meta):
        fields = ProjectListSerializer.Meta.fields + [
            'requirements',
            'expected_deliverables',
            'client_info',
            'is_applied'
        ]

    def get_client_info(self, obj):
        profile, created = ClientProfile.objects.get_or_create(user=obj.client)
        return ProjectClientSerializer(profile).data

    def get_is_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            try:
                freelancer_profile = request.user.freelancer_profile
                return obj.proposals.filter(freelancer=freelancer_profile).exists()
            except AttributeError:
                return False
        return False

class InvitationSerializer(serializers.ModelSerializer):
    client_name = serializers.ReadOnlyField(source='client.full_name')
    project_title = serializers.ReadOnlyField(source='project.title')
    package_type = serializers.ReadOnlyField(source='package.package_type')
    package_amount = serializers.ReadOnlyField(source='package.price')
    freelancer_name = serializers.ReadOnlyField(
        source='freelancer.user.full_name')
    freelancer_id = serializers.ReadOnlyField(
        source='freelancer.id')  # Useful for frontend mapping
    freelancer_image = serializers.ReadOnlyField(
        source='freelancer.user.profile_photo')
    freelancer_tagline = serializers.ReadOnlyField(
        source='freelancer.user.freelancer_profile.tagline')

    contract_info = serializers.SerializerMethodField()

    class Meta:
        model = Invitation
        fields = [
            'id', 'client', 'freelancer', 'project',
            'package', 'message', 'status', 'created_at',
            'client_name', 'project_title', 'package_type',
            'freelancer_name', 'freelancer_id', 'freelancer_image',
            'freelancer_tagline', 'package_amount', 'contract_info'
        ]
        read_only_fields = ['client', 'status', 'created_at']

    def get_contract_info(self, obj):

        contract = Contract.objects.filter(
            project=obj.project,
            freelancer=obj.freelancer.user
        ).first()

        if contract:
            return {
                "id": contract.id,
                "status": contract.status,
                "is_this_freelancer": True
            }
        return None

    def validate(self, data):
        request = self.context.get('request')
        if request and request.user == data['freelancer']:
            raise serializers.ValidationError(
                "You cannot invite yourself to a project.")
        return data


class ProposalsSerializer(serializers.ModelSerializer):
    bid_amount = serializers.DecimalField(
        max_digits=10, decimal_places=2, read_only=True)
    delivery_days = serializers.IntegerField(read_only=True)

    class Meta:
        model = Proposal
        fields = ['id', 'project', 'package', 'cover_letter',
                  'bid_amount', 'delivery_days', 'status']
        read_only_fields = ['status', 'freelancer']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        project = data.get('project')
        package = data.get('package')

    # 1. Ensure the user has a freelancer profile
        try:
            freelancer_profile = user.freelancer_profile
        except (AttributeError, ObjectDoesNotExist):
            raise serializers.ValidationError("Freelancer profile not found. You must be a freelancer to bid.")

    # 2. Check for duplicate proposals
        if Proposal.objects.filter(project=project, freelancer=freelancer_profile).exists():
            raise serializers.ValidationError("You have already submitted a proposal for this project.")

    # 3. Check for existing invitations
        if Invitation.objects.filter(
            project=project,
            freelancer=freelancer_profile,
            status__in=['pending', 'accepted']
    ).exists():
            raise serializers.ValidationError(
            "An active invitation exists for this project. Please manage it via your dashboard."
        )

    # 4. Project logic checks
        if project.status != 'open':
            raise serializers.ValidationError("This project is no longer accepting bids.")

        if project.client == user:
            raise serializers.ValidationError("You cannot bid on your own project.")

    # 5. Package Ownership Check
    # Ensure a package was actually selected
        if not package:
            raise serializers.ValidationError("A valid package must be selected for the proposal.")

    # Verify that the package belongs to the freelancer making the bid
    # Adjust 'package.freelancer' if your Package model uses a different field name
        if hasattr(package, 'freelancer'):
            if package.freelancer.user != user:
                raise serializers.ValidationError("The selected package does not belong to your profile.")
        elif hasattr(package, 'user'):
            if package.user != user:
                raise serializers.ValidationError("The selected package does not belong to your profile.")

    # 6. Success: Add the profile to the data so create() can use it
        data['freelancer'] = freelancer_profile
    
        return data

    def create(self, validated_data):
        package = validated_data['package']
        user = self.context['request'].user

        try:
            freelancer_profile = user.freelancer_profile
        except AttributeError:
            raise serializers.ValidationError(
                {"error": "Freelancer profile not found."})

        validated_data['freelancer'] = freelancer_profile
        validated_data['bid_amount'] = package.price
        validated_data['delivery_days'] = package.delivery_days

        return super().create(validated_data)


class ProposalsListSerializer(serializers.ModelSerializer):
    freelancer_name = serializers.CharField(source='freelancer.user.full_name')
    freelancer_ratings = serializers.CharField(source='freelancer.average_rating',read_only=True)
    freelancer_photo = serializers.CharField(
        source='freelancer.user.profile_photo', read_only=True)
    freelancer_tagline = serializers.CharField(
        source='freelancer.tagline', read_only=True)
    contract_info = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = [
            'id', 'freelancer_id', 'freelancer_name', 'freelancer_photo', 'freelancer_tagline','freelancer_ratings',
            'cover_letter', 'bid_amount', 'delivery_days', 'status', 'created_at', 'contract_info'
        ]

    def get_contract_info(self, obj):
        from contracts.models import Contract
        contract = Contract.objects.filter(project=obj.project).first()
        if contract:
            return {
                "id": contract.id,
                "status": contract.status,
                "is_this_freelancer": contract.freelancer.id == obj.freelancer.user.id
            }
        return None


class FreelancerProposalSerializer(serializers.ModelSerializer):
    project_title = serializers.CharField(
        source='project.title', read_only=True)
    client_name = serializers.CharField(
        source='project.client.full_name', read_only=True)
    contract_info = serializers.SerializerMethodField()

    class Meta:
        model = Proposal
        fields = [
            'id', 'project_id', 'project_title', 'client_name',
            'cover_letter', 'bid_amount', 'delivery_days',
            'status', 'created_at', 'contract_info'
        ]

    def get_contract_info(self, obj):
        from contracts.models import Contract
        contract = Contract.objects.filter(
            project=obj.project,
            freelancer=obj.freelancer.user
        ).first()
        if contract:
            return {
                "id": contract.id,
                "status": contract.status
            }
        return None
