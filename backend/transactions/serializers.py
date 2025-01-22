from rest_framework import serializers
from .models import Transaction
from budget.models import Budget   

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
        
    def validate(self, data):
        account = data.get('account')
        amount = data.get('amount')
        transaction_type = data.get('transaction_type')
        category = data.get('category')
        user = self.context['request'].user

        # Validate expense against current balance
        if transaction_type == 'expense' and amount > account.current_balance:
            raise serializers.ValidationError({
                'amount': f"Expense cannot exceed the current balance of {account.current_balance}."
            })

        # Validate amount against linked budgets
        if transaction_type == 'expense' and category:
            for budget in Budget.objects.filter(category=category , user=user):
                if amount > budget.remaining_amount():
                    period_name = dict(Budget.PERIOD_CHOICES)[budget.period]
                    # let's get the remaining amount of the budget in numbers
                    remaining_amount = budget.remaining_amount()        
                    raise serializers.ValidationError({
                        'amount': f"Transaction amount exceeds the remaining {remaining_amount} amount of {period_name} budget for {category.name}."
                    })

        return data