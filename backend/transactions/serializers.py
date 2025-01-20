from rest_framework import serializers
from .models import Transaction

class TransactionSerializer(serializers.ModelSerializer):
    account_name = serializers.CharField(source='account.name', read_only=True)  # Account name
    category_name = serializers.CharField(source='category.name', read_only=True)  # Category name

    class Meta:
        model = Transaction
        fields = [
            'id', 'user', 'account', 'account_name', 'category', 'category_name',
            'transaction_type', 'amount', 'description', 'created_at'
        ]
        read_only_fields = ['user', 'created_at']