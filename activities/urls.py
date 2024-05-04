from django.urls import path, include
from rest_framework import routers

import activities.views

router = routers.DefaultRouter()
router.register("activities", activities.views.ActivityViewSet, basename="activities")
router.register("deficiency-reports", activities.views.DeficiencyReportViewSet, basename="deficiency-reports")

urlpatterns = [
    path("", include(router.urls)),
    path('attendance/', activities.views.AttendanceViewSet.as_view(), name='attendance'),
]
