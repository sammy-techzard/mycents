from rest_framework import generics, permissions
from .models import Budget
from .serializers import BudgetSerializer
from rest_framework.exceptions import ValidationError

class BudgetListCreateView(generics.ListCreateAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        category = serializer.validated_data['category']
        period = serializer.validated_data['period']
        name = serializer.validated_data['name']

        # Check if a Budget already exists for the user, category, and period combination
        if Budget.objects.filter(user=user,name =name, category=category, period=period).exists():
            raise ValidationError({
                'name': ['You already have a budget with that name in this category and period.']
            })
        # Save the budget if no conflict exists
        serializer.save(user=user)

    def get_serializer_context(self):
        # Pass 'period' from the request into the serializer context
        context = super().get_serializer_context()
        context['period'] = self.request.data.get('period')  # Include the period in the context
        return context



class BudgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Budget.objects.filter(user=self.request.user)
