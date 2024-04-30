from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from tpm import perms as base_perms
from users import serializers, perms
from users.models import Account, Student, Assistant, Specialist
from users.utils import set_role, find_user


class AccountViewSet(viewsets.ViewSet, generics.ListAPIView, generics.CreateAPIView):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["account_details"]:
            return [permissions.IsAuthenticated()]

        if self.action in ["list"]:
            return [permissions.IsAdminUser()]

        if self.action in ["create"]:
            return [perms.AllowedCreateAccount()]

        return [permissions.AllowAny()]

    def create(self, request, *args, **kwargs):
        data = request.data

        user = find_user(data.pop("key")[0])
        if user is None:
            return Response(data={"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        if user.account:
            return Response(data={"message": "User already has an account"}, status=status.HTTP_400_BAD_REQUEST)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)

        account = Account(**serializer.validated_data)
        account.set_password(account.password)
        account.save()

        user.account = account
        user.save()
        set_role(user)

        return Response(serializers.AccountSerializer(account).data, status=status.HTTP_201_CREATED)

    @action(methods=["get"], detail=False, url_path="account-details")
    def account_details(self, request):
        return Response(data=serializers.AccountSerializer(request.user).data, status=status.HTTP_200_OK)


class SpecialistViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Specialist.objects.filter(is_active=True)
    serializer_class = serializers.SpecialistSerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]


class AssistantViewSet(viewsets.ViewSet, generics.ListAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = serializers.AssistantSerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]


class StudentViewSet(viewsets.ViewSet, generics.ListAPIView, generics.RetrieveAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = serializers.StudentSerializer
    permission_classes = [base_perms.HasActivitiesGroupPermission]
