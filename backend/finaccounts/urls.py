# finaccounts/urls.py

from django.urls import path
from .views import FinancialAccountListCreateView, FinancialAccountDetailView

urlpatterns = [
    path("finaccounts/", FinancialAccountListCreateView.as_view(), name="financialaccount-list-create"),
    path("finaccounts/<int:pk>/", FinancialAccountDetailView.as_view(), name="financialaccount-detail"),
]
