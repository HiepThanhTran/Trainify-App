from django.urls import path, include
from rest_framework import routers

from activities import views

router = routers.DefaultRouter()
router.register('activities', views.ActivityViewSet, basename='activities')
router.register('reports', views.MissingActivityReportViewSet, basename='reports')
router.register('bulletins', views.BulletinViewSet, basename='bulletins')

urlpatterns = [
    path('', include(router.urls)),
]
