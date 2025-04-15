// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const cartContentContainer = document.getElementById('cartContent');
const cartEmptyMessage = document.getElementById('cartEmpty');
const cartSummaryContainer = document.getElementById('cartSummary');
const cartSubtotalElement = document.getElementById('cartSubtotal');
const cartShippingElement = document.getElementById('cartShipping');
const cartTotalElement = document.getElementById('cartTotal');
const clearCartBtn = document.getElementById('clearCartBtn');
const checkoutBtn = document.getElementById('checkoutBtn');

// Toggle mobile menu
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];
const SHIPPING_THRESHOLD = 50; // Free shipping for orders over $50
const SHIPPING_COST = 10; // $10 shipping fee for orders under threshold

// Update cart count in the header
function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
  cartCountElements.forEach(element => {
    element.textContent = totalItems;
  });
}

// Initialize page
function initPage() {
  updateCartCount();
  renderCart();
  
  // Add event listeners
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }
}

// Render cart
function renderCart() {
  if (cart.length === 0) {
    // Show empty cart message
    cartEmptyMessage.classList.remove('hidden');
    cartContentContainer.innerHTML = '';
    cartSummaryContainer.classList.add('hidden');
    return;
  }
  
  // Hide empty cart message
  cartEmptyMessage.classList.add('hidden');
  cartSummaryContainer.classList.remove('hidden');
  
  // Create cart items HTML
  cartContentContainer.innerHTML = `
    <div class="cart-items">
      ${cart.map(item => {
        const product = getProductById(item.productId);
        return `
          <div class="cart-item" data-id="${product.id}">
            <div class="cart-item-img">
              <img src="${product.image}" alt="${product.name}">
            </div>
            <div class="cart-item-details">
              <h3>${product.name}</h3>
              <p class="cart-item-price">$${formatPrice(product.price)}</p>
            </div>
            <div class="cart-item-quantity">
              <button class="cart-quantity-btn minus" data-id="${product.id}">-</button>
              <input type="number" class="cart-quantity-value" value="${item.quantity}" min="1" max="10" readonly>
              <button class="cart-quantity-btn plus" data-id="${product.id}">+</button>
            </div>
            <div class="cart-item-total">$${formatPrice(product.price * item.quantity)}</div>
            <div class="cart-item-remove" data-id="${product.id}">
              <i class="fas fa-trash"></i>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
  
  // Calculate and update cart summary
  updateCartSummary();
  
  // Add event listeners to cart item buttons
  const minusButtons = document.querySelectorAll('.cart-quantity-btn.minus');
  const plusButtons = document.querySelectorAll('.cart-quantity-btn.plus');
  const removeButtons = document.querySelectorAll('.cart-item-remove');
  
  minusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'));
      updateCartItemQuantity(productId, -1);
    });
  });
  
  plusButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'));
      updateCartItemQuantity(productId, 1);
    });
  });
  
  removeButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = parseInt(button.getAttribute('data-id'));
      removeCartItem(productId);
    });
  });
}

// Update cart summary
function updateCartSummary() {
  const subtotal = cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product.price * item.quantity);
  }, 0);
  
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  
  cartSubtotalElement.textContent = `$${formatPrice(subtotal)}`;
  cartShippingElement.textContent = shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`;
  cartTotalElement.textContent = `$${formatPrice(total)}`;
  
  // Update checkout button state
  if (checkoutBtn) {
    if (subtotal === 0) {
      checkoutBtn.setAttribute('disabled', 'disabled');
      checkoutBtn.classList.add('disabled');
    } else {
      checkoutBtn.removeAttribute('disabled');
      checkoutBtn.classList.remove('disabled');
    }
  }
}

// Update cart item quantity
function updateCartItemQuantity(productId, change) {
  const cartItemIndex = cart.findIndex(item => item.productId === productId);
  
  if (cartItemIndex === -1) return;
  
  const newQuantity = cart[cartItemIndex].quantity + change;
  
  if (newQuantity < 1) {
    // Remove item if quantity is less than 1
    removeCartItem(productId);
  } else if (newQuantity <= 10) {
    // Update quantity
    cart[cartItemIndex].quantity = newQuantity;
    saveCartAndUpdate();
  }
}

// Remove cart item
function removeCartItem(productId) {
  cart = cart.filter(item => item.productId !== productId);
  saveCartAndUpdate();
}

// Clear cart
function clearCart() {
  cart = [];
  saveCartAndUpdate();
}

// Save cart to localStorage and update UI
function saveCartAndUpdate() {
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);
