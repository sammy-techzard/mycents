from django.db import models
from categories.models import Category
from django.conf import settings
from django.utils import timezone

class Budget(models.Model):
    PERIOD_CHOICES = [
        ('daily', 'Daily'),
        ('monthly', 'Monthly'),
        ('yearly', 'Yearly'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="budgets",
    )
    category = models.ForeignKey(
        Category,
        on_delete=models.CASCADE,
        related_name="budgets",
        help_text="The category this budget applies to"
    )
    name = models.CharField(
        max_length=100,
        help_text="The name of the budget",
        null=True,
    )
    period = models.CharField(
        max_length=10,
        choices=PERIOD_CHOICES,
        default='monthly',
        help_text="The budget period"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Budget amount for the period"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'category', 'period', 'name')  # Ensures no duplicate budgets per period
        ordering = ['-created_at']

    def __str__(self):
        return f"Budget for {self.category.name} ({self.period}) - {self.amount}"

    def remaining_amount(self):
        """Calculate remaining budget based on the period."""
        now = timezone.now()
        total_spent = 0

        # Filter transactions based on the selected period
        if self.period == 'daily':
            # For daily, filter transactions within the current day
            transactions = self.category.transactions.filter(
                created_at__date=now.date()  # Filtering by today's date
            )
        elif self.period == 'monthly':
            # For monthly, filter transactions within the current month
            transactions = self.category.transactions.filter(
                created_at__year=now.year,
                created_at__month=now.month
            )
        elif self.period == 'yearly':
            # For yearly, filter transactions within the current year
            transactions = self.category.transactions.filter(
                created_at__year=now.year
            )

        # Sum the amounts spent in the relevant period
        total_spent = sum(transaction.amount for transaction in transactions)

        # Return the remaining budget amount
        return self.amount - total_spent
    # def linked_transactions(self):
    #     return self.category.transactions.all()
