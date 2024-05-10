from django.urls import path, include
from rest_framework import routers

from schools import views

router = routers.DefaultRouter()
router.register("semesters", views.SemesterViewSet, basename="semesters")
router.register("criterions", views.CriterionViewSet, basename="criterions")
router.register("attendance", views.AttendanceUploadViewSet, basename="attendance")
router.register("statistics", views.StatisticsViewSet, basename="statistics")

urlpatterns = [
    path("", include(router.urls))
]
