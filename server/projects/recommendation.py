from decimal import Decimal
from profiles.models import FreelancerProfile, FreelancerSkill, FreelancerPackage
from django.db.models import Q
from .models import Project

def get_freelancer_context(user):
    freelancer = FreelancerProfile.objects.select_related("category").get(user=user)

    skills = list(
        FreelancerSkill.objects.filter(user=user)
        .values_list("skill__name", "custom_name")
    )

    skill_names = {
        (s[0] or s[1]).lower() for s in skills if (s[0] or s[1])
    }

    pro_price = FreelancerPackage.objects.filter(
        user=user,
        package_type="pro"
    ).values_list("price", flat=True).first()

    return freelancer, skill_names, pro_price or Decimal("0")


def get_recommended_projects(user):
    freelancer, skill_names, pro_price = get_freelancer_context(user)

    qs = (
        Project.objects.filter(
            status="open",
            is_active=True,
            category=freelancer.category
        )
        .select_related("category")
        .prefetch_related("project_skills__skill")
    )

    qs = qs.filter(
        Q(pricing_type="fixed", fixed_price__gte=pro_price) |
        Q(pricing_type="range", max_budget__gte=pro_price)
    )

    matched_projects = []
    for project in qs:
        project_skills = {
            (ps.skill.name if ps.skill else ps.custom_name).lower()
            for ps in project.project_skills.all()
            if (ps.skill or ps.custom_name)
        }

        if project_skills & skill_names:
            matched_projects.append(project)

    return matched_projects