from django.urls import path, include
from rest_framework import routers

from schools import views

router = routers.DefaultRouter()
router.register('semesters', views.SemesterViewSet, basename='semesters')
router.register('criterions', views.CriterionViewSet, basename='criterions')
router.register('statistics', views.StatisticsViewSet, basename='statistics')
router.register('files', views.FileViewSet, basename='files')

urlpatterns = [
    path('', include(router.urls)),
]
