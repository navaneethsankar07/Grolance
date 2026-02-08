from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class GlobalSettings(models.Model):
    support_email = models.EmailField(default="support@yourdomain.com")
    commission_percentage = models.DecimalField(
        max_digits=5, 
        decimal_places=2, 
        default=10.00,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text="Percentage taken by the platform from each contract."
    )
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Global Settings"
        verbose_name_plural = "Global Settings"

    def save(self, *args, **kwargs):
        self.pk = 1 
        super(GlobalSettings, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        pass

    def __str__(self):
        return "Global Platform Settings"