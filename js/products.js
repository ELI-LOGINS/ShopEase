// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const productsGridContainer = document.getElementById('productsGrid');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const categoryFilter = document.getElementById('categoryFilter');
const sortFilter = document.getElementById('sortFilter');

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
  renderProducts();
  
  // Add event listeners
  if (searchButton) {
    searchButton.addEventListener('click', () => {
      renderProducts();
    });
  }
  
  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        renderProducts();
      }
    });
  }
  
  if (categoryFilter) {
    categoryFilter.addEventListener('change', renderProducts);
  }
  
  if (sortFilter) {
    sortFilter.addEventListener('change', renderProducts);
  }
}

// Render products
function renderProducts() {
  // Get filter values
  const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
  const categoryValue = categoryFilter ? categoryFilter.value : '';
  const sortValue = sortFilter ? sortFilter.value : 'default';
  
  // Filter products
  let filteredProducts = [...products];
  
  // Apply search filter
  if (searchQuery) {
    filteredProducts = filteredProducts.filter(product => 
      product.name.toLowerCase().includes(searchQuery) || 
      product.description.toLowerCase().includes(searchQuery)
    );
  }
  
  // Apply category filter
  if (categoryValue) {
    filteredProducts = filteredProducts.filter(product => 
      product.category === categoryValue
    );
  }
  
  // Apply sorting
  if (sortValue === 'price-asc') {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortValue === 'price-desc') {
    filteredProducts.sort((a, b) => b.price - a.price);
  } else if (sortValue === 'name-asc') {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  // Render products
  if (productsGridContainer) {
    if (filteredProducts.length === 0) {
      productsGridContainer.innerHTML = `
        <div class="no-products">
          <p>No products found matching your criteria.</p>
        </div>
      `;
    } else {
      productsGridContainer.innerHTML = filteredProducts.map(product => `
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
  }
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

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);
