# categories/admin.py

from django.contrib import admin
from .models import Category

@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "user",  "created_at")
    search_fields = ("name", "user__username")
    list_filter = ("created_at",)
