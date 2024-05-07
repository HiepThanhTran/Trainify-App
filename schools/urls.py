from django.urls import path, include
from rest_framework import routers

from schools import views

router = routers.DefaultRouter()
router.register("criterions", views.CriterionViewSet, basename="criterions")

urlpatterns = [
    path("", include(router.urls))
]
