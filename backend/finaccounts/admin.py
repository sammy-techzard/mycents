# finaccounts/admin.py

from django.contrib import admin
from .models import FinancialAccount

@admin.register(FinancialAccount)
class FinancialAccountAdmin(admin.ModelAdmin):
    list_display = ("name", "user", "initial_balance", "current_balance", "created_at")
    search_fields = ("name", "user__username")
    list_filter = ("created_at",)
