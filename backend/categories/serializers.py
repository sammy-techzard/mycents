# categories/serializers.py

from rest_framework import serializers
from .models import Category
from transactions.models import Transaction

class CategorySerializer(serializers.ModelSerializer):
    transaction_count = serializers.SerializerMethodField()
    class Meta:
        model = Category
        fields = ['id', 'name', 'icon', 'transaction_type', 'created_at', 'transaction_count']
        read_only_fields = ["created_at", "updated_at", "user"]

    def validate_name(self, value):
        user = self.context['request'].user
        account_id = self.instance.id if self.instance else None

        # Check if another account with the same name exists for the user
        if Category.objects.filter(name=value, user=user).exclude(id=account_id).exists():
            raise serializers.ValidationError("You already have a category with that name")
        return value

    def get_transaction_count(self, obj):
        return obj.transactions.count()  # Assuming a related_name='transactions' in Transaction model
