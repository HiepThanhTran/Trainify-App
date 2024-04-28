from django.contrib import admin


class MyAdminSite(admin.AdminSite):
    site_title = 'TPM site admin'
    site_header = 'Training point management administration'
    index_title = 'TPM administration'


my_admin_site = MyAdminSite(name='Training Point Management')
