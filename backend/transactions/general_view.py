from django.db.models import Sum
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from finaccounts.models import FinancialAccount
from .models import Transaction

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def financial_summary(request):
    user = request.user

    # Calculate total income, total expense, and total balance for the user
    total_income = Transaction.objects.filter(
        user=user, transaction_type='income'
    ).aggregate(total=Sum('amount'))['total'] or 0

    total_expense = Transaction.objects.filter(
        user=user, transaction_type='expense'
    ).aggregate(total=Sum('amount'))['total'] or 0

    total_balance = FinancialAccount.objects.filter(user=user).aggregate(
        total=Sum('current_balance')
    )['total'] or 0

    # Group transactions by type and date for graphical representation
    income_data = (
        Transaction.objects.filter(user=user, transaction_type='income')
        .values('created_at__date')
        .annotate(total=Sum('amount'))
        .order_by('created_at__date')
    )

    expense_data = (
        Transaction.objects.filter(user=user, transaction_type='expense')
        .values('created_at__date')
        .annotate(total=Sum('amount'))
        .order_by('created_at__date')
    )

    # Prepare response data
    response_data = {
        'total_income': total_income,
        'total_expense': total_expense,
        'total_balance': total_balance,
        'income_data': list(income_data),
        'expense_data': list(expense_data),
    }

    return Response(response_data)
