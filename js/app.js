// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const featuredProductsContainer = document.getElementById('featuredProducts');

// Toggle mobile menu
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

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
  
  // Render featured products if on home page
  if (featuredProductsContainer) {
    renderFeaturedProducts();
  }
}

// Render featured products on home page
function renderFeaturedProducts() {
  const featuredProducts = getFeaturedProducts();
  
  featuredProductsContainer.innerHTML = featuredProducts.map(product => `
    <div class="product-card animate-fadeIn">
      <a href="product.html?id=${product.id}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}">
          ${product.featured ? '<span class="product-badge">Featured</span>' : ''}
        </div>
        <div class="product-info">
          <h3 class="product-name">${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-footer">
            <span class="product-price">$${formatPrice(product.price)}</span>
            <button class="add-to-cart" data-id="${product.id}">
              <i class="fas fa-shopping-cart"></i>
              <span class="add-text">Add</span>
            </button>
          </div>
        </div>
      </a>
    </div>
  `).join('');
  
  // Add event listeners to Add to Cart buttons
  const addToCartButtons = document.querySelectorAll('.add-to-cart');
  addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const productId = parseInt(button.getAttribute('data-id'));
      addToCart(productId, 1);
    });
  });
}

// Add product to cart
function addToCart(productId, quantity) {
  const product = getProductById(productId);
  
  if (!product) return;
  
  // Check if product is already in cart
  const existingItemIndex = cart.findIndex(item => item.productId === productId);
  
  if (existingItemIndex > -1) {
    // Update quantity if already in cart
    cart[existingItemIndex].quantity += quantity;
  } else {
    // Add new item to cart
    cart.push({
      productId,
      quantity
    });
  }
  
  // Save cart to localStorage
  localStorage.setItem('cart', JSON.stringify(cart));
  
  // Update cart count
  updateCartCount();
  
  // Show notification
  showNotification(`Added ${product.name} to cart`);
}

// Show notification
function showNotification(message) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-check-circle"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add to body
  document.body.appendChild(notification);
  
  // Show notification
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Add styles for notification
const style = document.createElement('style');
style.innerHTML = `
  .notification {
    position: fixed;
    top: 20px;
    right: 20px;
    transform: translateX(150%);
    background-color: #4a6cf7;
    color: white;
    padding: 15px 20px;
    border-radius: 4px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
    z-index: 1000;
    transition: transform 0.3s ease;
  }
  
  .notification.show {
    transform: translateX(0);
  }
  
  .notification-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
`;
document.head.appendChild(style);

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);
