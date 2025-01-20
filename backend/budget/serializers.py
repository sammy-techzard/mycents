from rest_framework import serializers
from .models import Budget


class BudgetSerializer(serializers.ModelSerializer):
    remaining_amount = serializers.DecimalField(max_digits=10, decimal_places=2, read_only=True)
    category_name = serializers.CharField(source="category.name", read_only=True)  # Fetch category name

    class Meta:
        model = Budget
        fields = [
            'id', 'user', 'category', 'category_name', 'period', 'amount', 'created_at', 'remaining_amount', 'name'
        ]
        read_only_fields = ['user']
