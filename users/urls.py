from django.urls import path, include
from rest_framework import routers

from users import views

router = routers.DefaultRouter()
router.register("accounts", views.AccountViewSet, basename="accounts")
router.register("users", views.UserViewSet, basename="users")
router.register("students", views.StudentViewSet, basename="students")
router.register("assistants", views.AssistantViewSet, basename="assistants")
router.register("specialists", views.SpecialistViewSet, basename="specialists")

urlpatterns = [
    path("", include(router.urls)),
]
