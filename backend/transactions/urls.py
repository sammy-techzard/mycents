from django.urls import path
from .views import TransactionListCreateView, TransactionDetailView
from .general_view import financial_summary
urlpatterns = [
    path('transactions/', TransactionListCreateView.as_view(), name='transaction-list-create'),
    path('transactions/<int:pk>/', TransactionDetailView.as_view(), name='transaction-detail'),
    path('financial-summary/', financial_summary, name='financial-summary'),
]