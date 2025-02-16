document.addEventListener("DOMContentLoaded", function() {
    // Load books from Django API
    fetch("/api/book/books/")
        .then(response => response.json())
        .then(data => {
            let bookList = document.getElementById("book-list");
            data.forEach(book => {
                let bookItem = document.createElement("div");
                bookItem.className = "book-item";
                bookItem.innerHTML = `
                    <h3>${book.title}</h3>
                    <p>Author: ${book.author}</p>
                    <p>Price: $${book.price}</p>
                    <button onclick="addToCart(${book.id})">Add to Cart</button>
                `;
                bookList.appendChild(bookItem);
            });
        });

    // Fetch cart information
    fetchCart();
});

// Get CSRF token from cookie
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Fetch cart items from API
function fetchCart() {
    fetch("/api/cart/cartitems/", {
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}` // if you're using token auth
        },
        credentials: 'include' // This is important for sending cookies
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        let cartItems = document.getElementById("cart-items");
        cartItems.innerHTML = ""; // Reset old content

        data.forEach(item => {
            let cartItem = document.createElement("div");
            cartItem.className = "cart-item";
            cartItem.innerHTML = `
                <p>${item.book ? item.book.title : 'Unknown'} - Quantity: ${item.quantity}</p>
                <button onclick="removeFromCart(${item.id})" class="btn btn-danger btn-sm">Remove</button>
            `;
            cartItems.appendChild(cartItem);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Add to cart function
function addToCart(bookId) {
    fetch("/api/cart/cartitems/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}` // if you're using token auth
        },
        credentials: 'include',
        body: JSON.stringify({
            "book_id": bookId,
            "quantity": 1
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        alert("Book added to cart!");
        fetchCart();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error adding book to cart. Please try again.");
    });
}

// Remove from cart function
function removeFromCart(itemId) {
    fetch(`/api/cart/cartitems/${itemId}/`, {
        method: "DELETE",
        headers: {
            'X-CSRFToken': getCookie('csrftoken'),
            'Authorization': `Bearer ${localStorage.getItem('token')}` // if you're using token auth
        },
        credentials: 'include'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        fetchCart();
    })
    .catch(error => {
        console.error('Error:', error);
        alert("Error removing item from cart. Please try again.");
    });
}

// Handle logout
function handleLogout(event) {
    event.preventDefault();
    
    // Clear any stored tokens or session data
    localStorage.removeItem('cartItems');
    sessionStorage.clear();
    
    // Redirect to logout URL
    window.location.href = event.target.closest('a').href;
}