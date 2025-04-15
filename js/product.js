// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const productDetailContainer = document.getElementById('productDetail');
const relatedProductsContainer = document.getElementById('relatedProducts');
const productNameBreadcrumb = document.getElementById('productName');

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

// Get product ID from URL
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

// Initialize page
function initPage() {
  updateCartCount();
  
  const productId = getProductIdFromUrl();
  
  if (productId) {
    renderProductDetail(productId);
    renderRelatedProducts(productId);
  } else {
    window.location.href = 'products.html';
  }
}

// Render product detail
function renderProductDetail(productId) {
  const product = getProductById(productId);
  
  if (!product) {
    window.location.href = 'products.html';
    return;
  }
  
  // Update page title and breadcrumb
  document.title = `${product.name} - ShopEase`;
  productNameBreadcrumb.textContent = product.name;
  
  // Render product detail
  productDetailContainer.innerHTML = `
    <div class="product-gallery">
      <div class="product-image-main">
        <img src="${product.image}" alt="${product.name}">
      </div>
    </div>
    <div class="product-info-detail">
      <h1 class="product-title">${product.name}</h1>
      <div class="product-price-detail">$${formatPrice(product.price)}</div>
      <div class="product-description-detail">${product.description}</div>
      
      <div class="product-meta">
        <div class="meta-item">
          <span class="meta-label">Category:</span>
          <span>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Rating:</span>
          <span>${product.rating} ★ (${product.reviews} reviews)</span>
        </div>
        <div class="meta-item">
          <span class="meta-label">Availability:</span>
          <span>${product.inStock ? 'In Stock' : 'Out of Stock'}</span>
        </div>
      </div>
      
      <div class="product-quantity">
        <div class="quantity-input">
          <button class="quantity-btn minus" id="decreaseQuantity">-</button>
          <input type="number" class="quantity-value" id="quantityInput" value="1" min="1" max="10">
          <button class="quantity-btn plus" id="increaseQuantity">+</button>
        </div>
      </div>
      
      <button class="btn btn-primary add-to-cart-detail" id="addToCartBtn">
        <i class="fas fa-shopping-cart"></i>
        Add to Cart
      </button>
    </div>
  `;
  
  // Add event listeners
  const decreaseBtn = document.getElementById('decreaseQuantity');
  const increaseBtn = document.getElementById('increaseQuantity');
  const quantityInput = document.getElementById('quantityInput');
  const addToCartBtn = document.getElementById('addToCartBtn');
  
  decreaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
    }
  });
  
  increaseBtn.addEventListener('click', () => {
    const currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1;
    }
  });
  
  addToCartBtn.addEventListener('click', () => {
    const quantity = parseInt(quantityInput.value);
    addToCart(parseInt(productId), quantity);
  });
}

// Render related products
function renderRelatedProducts(productId) {
  const relatedProducts = getRelatedProducts(productId);
  
  relatedProductsContainer.innerHTML = relatedProducts.map(product => `
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
  showNotification(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart`);
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

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);
