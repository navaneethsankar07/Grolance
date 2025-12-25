from django.db import models

# Create your models here.
class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="skills"
    )
    is_custom = models.BooleanField(default=False)

    class Meta:
        unique_together = ("name", "category")

    def __str__(self):
        return self.name
