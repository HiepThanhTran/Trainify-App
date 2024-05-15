from django.contrib import admin
from django.contrib.auth.models import Permission, Group
from django.template.response import TemplateResponse
from django.urls import path


class MyAdminSite(admin.AdminSite):
    site_title = 'TPM site admin'
    site_header = 'Training point management administration'
    index_title = 'TPM administration'

    def get_urls(self):
        return [path('statistics/', self.statistics_view)] + super().get_urls()

    def statistics_view(self, request):
        return TemplateResponse(request, 'admin/statistics.html',
                                context={
                                    'site_title': 'TPM site admin',
                                    'site_header': 'Training point management administration',
                                    'index_title': 'TPM administration',
                                    'title': 'Course statistics',
                                    'content': 'This is a course statistics page',
                                })


my_admin_site = MyAdminSite(name='Training Point Management')

my_admin_site.register(Group)
my_admin_site.register(Permission)
