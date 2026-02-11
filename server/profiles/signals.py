from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.db.models import Avg, Count
from .models import Review, ClientProfile, FreelancerProfile

@receiver([post_save, post_delete], sender=Review)
def update_profile_ratings(sender, instance, **kwargs):
    reviewee = instance.reviewee
    review_type = instance.review_type

    stats = Review.objects.filter(
        reviewee=reviewee, 
        review_type=review_type
    ).aggregate(
        avg_rating=Avg('rating'),
        count=Count('id')
    )

    new_avg = stats['avg_rating'] or 0.00
    new_count = stats['count'] or 0

    if review_type == 'freelancer':
        FreelancerProfile.objects.filter(user=reviewee).update(
            average_rating=new_avg,
            review_count=new_count
        )
    elif review_type == 'client':
        ClientProfile.objects.filter(user=reviewee).update(
            average_rating=new_avg,
            review_count=new_count
        )