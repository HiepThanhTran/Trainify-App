from django.urls import path, include
from rest_framework import routers

from users import views

router = routers.DefaultRouter()
router.register("accounts", views.AccountViewSet, basename="accounts")

urlpatterns = [
    path("", include(router.urls)),
]
