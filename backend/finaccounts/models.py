from django.db import models
from django.conf import settings

class FinancialAccount(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="financial_accounts"
    )
    name = models.CharField(max_length=100)
    initial_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    current_balance = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    icon = models.CharField(max_length=50, help_text="React Icon class name (e.g., 'fa-solid fa-wallet')")
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Financial Account"
        verbose_name_plural = "Financial Accounts"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.user.username})"

    def update_balance(self, amount, transaction_type="add"):
        if transaction_type == "add":
            self.current_balance += amount
        elif transaction_type == "subtract":
            if self.current_balance >= amount:
                self.current_balance -= amount
            else:
                raise ValueError("Insufficient funds for this transaction.")
        else:
            raise ValueError("Invalid transaction type. Use 'add' or 'subtract'.")
        self.save()
