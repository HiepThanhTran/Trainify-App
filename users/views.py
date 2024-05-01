from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from tpm import perms as base_perms
from users import serializers, perms
from users.models import Account, Student, Assistant, Specialist


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["account_details"]:
            return [permissions.IsAuthenticated()]

        if self.action in ["create"]:
            return [perms.AllowedCreateAccount()]

        return [permissions.IsAdminUser()]

    @action(methods=["get"], detail=False, url_path="account-details")
    def account_details(self, request):
        return Response(data=serializers.AccountSerializer(request.user).data, status=status.HTTP_200_OK)


class SpecialistViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Specialist.objects.select_related("faculty").filter(is_active=True)
    serializer_class = serializers.SpecialistSerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Assistant.objects.select_related("faculty").filter(is_active=True)
    serializer_class = serializers.AssistantSerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects \
        .select_related("faculty", "major", "class_name", "academic_year", "educational_system") \
        .filter(is_active=True)
    serializer_class = serializers.StudentSerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]
