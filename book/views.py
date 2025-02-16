from rest_framework import viewsets
from .models import Book
from .serializers import BookSerializer
from django.shortcuts import render

class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer

def home(request):
    books = Book.objects.all()
    context = {
        'books': books,
    }
    return render(request, 'index.html', context)
