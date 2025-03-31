from django.contrib import admin
from django.urls import path, include
from django.conf import settings


urlpatterns = [
    path('accounts/', include('accounts.urls')),
    path('accounts/', include('django.contrib.auth.urls')),
    path('admin/', admin.site.urls),
    path('', include('elections.urls')),
]
