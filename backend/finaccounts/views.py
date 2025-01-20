from rest_framework import generics, permissions
from rest_framework.pagination import PageNumberPagination
from .models import FinancialAccount
from .serializers import FinancialAccountSerializer

class FinancialAccountPagination(PageNumberPagination):
    page_size = 10

class FinancialAccountListCreateView(generics.ListCreateAPIView):
    serializer_class = FinancialAccountSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = FinancialAccountPagination

    def get_queryset(self):
        return FinancialAccount.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        """
        Override the perform_create method to ensure the user is assigned correctly.
        """
        serializer.save(user=self.request.user)

class FinancialAccountDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = FinancialAccount.objects.all()
    serializer_class = FinancialAccountSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return FinancialAccount.objects.filter(user=self.request.user)