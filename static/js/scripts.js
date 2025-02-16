document.addEventListener("DOMContentLoaded", function() {
    // Fetch cart information only
    fetchCart();
});

// Get CSRF token
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
function addToCart(bookId, button) {
    const card = button.closest('.book-card');
    const quantityInput = card.querySelector('.quantity-input');
    const quantity = parseInt(quantityInput.value);
    
    const csrftoken = getCookie('csrftoken');
    
    fetch("/api/cart/cartitems/", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            "book": bookId,  // Changed from book_id to book
            "quantity": quantity
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        // Show success message
        alert('Book added to cart successfully!');
        // Reset quantity to 1
        quantityInput.value = 1;
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error adding book to cart. Please try again.');
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

// Quantity control functions
function incrementQuantity(button) {
    const input = button.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    if (currentValue < 99) {
        input.value = currentValue + 1;
    }
}

function decrementQuantity(button) {
    const input = button.parentElement.querySelector('.quantity-input');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
    }
}