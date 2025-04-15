// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const orderNumberElement = document.getElementById('orderNumber');

// Toggle mobile menu
if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

// Initialize page
function initPage() {
  // Cart should be empty at this point
  updateCartCount();
  
  // Get last order info
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder')) || null;
  
  if (lastOrder && orderNumberElement) {
    orderNumberElement.textContent = lastOrder.orderNumber;
  } else if (orderNumberElement) {
    const randomOrderNumber = `ORDER-${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`;
    orderNumberElement.textContent = randomOrderNumber;
  }
}

// Update cart count in the header
function updateCartCount() {
  cartCountElements.forEach(element => {
    element.textContent = '0';
  });
}

// Initialize the page
document.addEventListener('DOMContentLoaded', initPage);
