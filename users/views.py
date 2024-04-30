from rest_framework import viewsets, permissions, generics, status, parsers
from rest_framework.decorators import action
from rest_framework.response import Response

from users import serializers
from users.models import Account, Student, Administrator, Assistant, Specialist


class AccountViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Account.objects.filter(is_active=True)
    serializer_class = serializers.AccountSerializer
    parser_classes = [parsers.MultiPartParser, ]

    def get_permissions(self):
        if self.action in ["account"]:
            return [permissions.IsAuthenticated()]

        return [permissions.AllowAny()]

    @action(methods=["get"], detail=False, url_path="account-details")
    def account(self, request):
        account = request.user

        return Response(data=serializers.AccountSerializer(account).data, status=status.HTTP_200_OK)


class AdministratorViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Administrator.objects.filter(is_active=True)
    serializer_class = serializers.AdministratorSerializer


class AssistantViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Assistant.objects.filter(is_active=True)
    serializer_class = serializers.AssistantSerializer


class SpecialistViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Specialist.objects.filter(is_active=True)
    serializer_class = serializers.SpecialistSerializer


class StudentViewSet(viewsets.ViewSet, generics.CreateAPIView):
    queryset = Student.objects.filter(is_active=True)
    serializer_class = serializers.StudentSerializer
