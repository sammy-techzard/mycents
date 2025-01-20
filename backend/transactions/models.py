# models.py
from django.db import models
from django.contrib.auth.models import User
from finaccounts.models import FinancialAccount
from categories.models import Category
from django.core.exceptions import ValidationError

class Transaction(models.Model):
    TRANSACTION_TYPE_CHOICES = [
        ('income', 'Income'),
        ('expense', 'Expense'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="transactions")
    account = models.ForeignKey(FinancialAccount, on_delete=models.CASCADE, related_name="transactions")
    category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="transactions"
    )
    transaction_type = models.CharField(max_length=10, choices=TRANSACTION_TYPE_CHOICES)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.transaction_type} - {self.amount}"

    def clean(self):
        """Custom validation to ensure expense does not exceed current balance."""
        if self.transaction_type == 'expense' and self.amount > self.account.current_balance:
            raise ValidationError({
                'amount': [f"Expense cannot exceed the current balance of {self.account.current_balance}."]
            })

    def save(self, *args, **kwargs):
        # Run the custom validation
        self.clean()

        if not self.pk:  # Only adjust account balance on new transactions
            if self.transaction_type == 'income':
                self.account.current_balance += self.amount
            elif self.transaction_type == 'expense':
                self.account.current_balance -= self.amount
            self.account.save()
        super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # Reverse the balance update when deleting a transaction
        if self.transaction_type == 'income':
            self.account.current_balance -= self.amount
        elif self.transaction_type == 'expense':
            self.account.current_balance += self.amount
        self.account.save()
        super().delete(*args, **kwargs)
