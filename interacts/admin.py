# from django.contrib import admin
from interacts.models import Comment, Like
from tpm.admin import my_admin_site

my_admin_site.register(Comment)
my_admin_site.register(Like)
