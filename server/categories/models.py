from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=100, unique=True)

    class Meta:
        indexes = [
            models.Index(fields=['name']),
        ]

    def __str__(self):
        return self.name


class Skill(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(
        Category,
        on_delete=models.PROTECT,
        null=True,
        blank=True,
        related_name="skills"
    )
    is_custom = models.BooleanField(default=False)

    class Meta:
        unique_together = ("name", "category")
        indexes = [
            models.Index(fields=['name']),
            models.Index(fields=['is_custom']),
        ]

    def __str__(self):
        return self.name