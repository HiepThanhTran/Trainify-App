from django.contrib import admin
from django.contrib.auth.models import Permission, Group


class MyAdminSite(admin.AdminSite):
    site_title = 'TPM site admin'
    site_header = 'Training point management administration'
    index_title = 'TPM administration'


my_admin_site = MyAdminSite(name='Training Point Management')

my_admin_site.register(Group)
my_admin_site.register(Permission)
