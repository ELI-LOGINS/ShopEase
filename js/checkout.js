// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const orderItemsContainer = document.getElementById('orderItems');
const summarySubtotalElement = document.getElementById('summarySubtotal');
const summaryShippingElement = document.getElementById('summaryShipping');
const summaryTotalElement = document.getElementById('summaryTotal');
const checkoutForm = document.getElementById('checkoutForm');

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
  // Redirect to cart if cart is empty
  if (cart.length === 0) {
    window.location.href = 'cart.html';
    return;
  }
  
  updateCartCount();
  renderOrderSummary();
  
  // Add event listeners
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', handleCheckout);
  }
}

// Render order summary
function renderOrderSummary() {
  // Create order items HTML
  orderItemsContainer.innerHTML = cart.map(item => {
    const product = getProductById(item.productId);
    return `
      <div class="summary-item">
        <span class="summary-item-name">${product.name}</span>
        <span class="summary-item-quantity">x${item.quantity}</span>
        <span class="summary-item-price">$${formatPrice(product.price * item.quantity)}</span>
      </div>
    `;
  }).join('');
  
  // Calculate and update summary
  const subtotal = cart.reduce((total, item) => {
    const product = getProductById(item.productId);
    return total + (product.price * item.quantity);
  }, 0);
  
  const shipping = subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;
  
  summarySubtotalElement.textContent = `$${formatPrice(subtotal)}`;
  summaryShippingElement.textContent = shipping === 0 ? 'Free' : `$${formatPrice(shipping)}`;
  summaryTotalElement.textContent = `$${formatPrice(total)}`;
}

// Handle checkout form submission
function handleCheckout(e) {
  e.preventDefault();
  
  // Get form data
  const formData = new FormData(checkoutForm);
  const orderData = {
    customerInfo: {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      zipCode: formData.get('zipCode')
    },
    paymentInfo: {
      cardName: formData.get('cardName'),
      cardNumber: formData.get('cardNumber'),
      expDate: formData.get('expDate'),
      cvv: formData.get('cvv')
    },
    items: cart,
    orderDate: new Date().toISOString(),
    orderNumber: `ORDER-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`
  };
  
  // Save order to localStorage (in a real app, this would be sent to a server)
  localStorage.setItem('lastOrder', JSON.stringify(orderData));
  
  // Clear cart
  localStorage.setItem('cart', JSON.stringify([]));
  
  // Redirect to success page
  window.location.href = 'order-success.html';
}

// Input validation
function setupFormValidation() {
  // Card number formatting
  const cardNumberInput = document.getElementById('cardNumber');
  if (cardNumberInput) {
    cardNumberInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 16) value = value.slice(0, 16);
      
      // Add spaces
      const formatted = value.replace(/(\d{4})(?=\d)/g, '$1 ');
      e.target.value = formatted;
    });
  }
  
  // Expiration date formatting
  const expDateInput = document.getElementById('expDate');
  if (expDateInput) {
    expDateInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      
      // Add slash
      if (value.length > 2) {
        value = value.slice(0, 2) + '/' + value.slice(2);
      }
      
      e.target.value = value;
    });
  }
  
  // CVV formatting
  const cvvInput = document.getElementById('cvv');
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 4) value = value.slice(0, 4);
      e.target.value = value;
    });
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  initPage();
  setupFormValidation();
});
