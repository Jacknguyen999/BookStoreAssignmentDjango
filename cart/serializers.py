from rest_framework import serializers
from .models import CartItem
from book.models import Book

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Book
        fields = ['id', 'title', 'author', 'price']

class CartItemSerializer(serializers.ModelSerializer):
    book = BookSerializer()

    class Meta:
        model = CartItem
        fields = ['id', 'book', 'quantity', 'added_at']