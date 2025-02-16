from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.shortcuts import render

def home(request):
    return render(request, 'index.html', {'user': request.user})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('accounts/', include('accounts.urls')),
    path('api/cart/', include('cart.urls')),
    path('api/book/', include('book.urls')),
    path('api/customer/', include('customer.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS)