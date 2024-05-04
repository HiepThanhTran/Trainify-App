from django.urls import path, include
from rest_framework import routers

from users import views

router = routers.DefaultRouter()
router.register("accounts", views.AccountViewSet, basename="accounts")
router.register("students", views.StudentViewSet, basename="students")
router.register("assistants", views.AssistantViewSet, basename="assistants")

urlpatterns = [
    path("", include(router.urls)),
]
