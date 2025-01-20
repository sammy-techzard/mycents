# finaccounts/serializers.py

from rest_framework import serializers
from .models import FinancialAccount

class FinancialAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = FinancialAccount
        fields = "__all__"
        read_only_fields = ["current_balance", "created_at", "updated_at", "user"]

    def validate_name(self, value):
        user = self.context['request'].user
        account_id = self.instance.id if self.instance else None

        # Check if another account with the same name exists for the user
        if FinancialAccount.objects.filter(name=value, user=user).exclude(id=account_id).exists():
            raise serializers.ValidationError("You already have an account with this name.")
        return value

    def create(self, validated_data):
        """
        Override the create method to set current_balance equal to initial_balance.
        """
        validated_data["current_balance"] = validated_data.get("initial_balance", 0)
        return super().create(validated_data)
