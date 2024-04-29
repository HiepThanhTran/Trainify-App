from django.urls import path, include
from rest_framework import routers

from interacts import views

router = routers.DefaultRouter()
router.register("accounts", views.CommentViewSet, basename="comments")

urlpatterns = [
    path("", include(router.urls)),
]
