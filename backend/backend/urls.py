"""
URL configuration for backend project.
"""

from django.contrib import admin
from django.urls import path, include
from contacts.views import home


urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('contacts.urls')),
]