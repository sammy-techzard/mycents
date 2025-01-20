# categories/models.py

from django.db import models
from django.conf import settings

class Category(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
        ('transfer', 'Transfer'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="categories"
    )
    name = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, blank=True, null=True, help_text="Optional icon for visualization")
    transaction_type = models.CharField(
        max_length=10,
        choices=TRANSACTION_TYPE_CHOICES,
        default='expense',
        help_text="The type of transactions this category applies to"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'name')  # Ensures category names are unique per user
        ordering = ['name']
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.transaction_type}) ({self.user.username})"
