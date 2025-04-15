// DOM Elements
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.getElementById('navLinks');
const cartCountElements = document.querySelectorAll('.cart-count');
const contactForm = document.getElementById('contactForm');

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
  
  // Set up contact form submission
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
}

// Handle contact form submission
function handleContactSubmit(e) {
  e.preventDefault();
  
  // Get form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;
  
  // In a real application, you would send this data to a server
  // For now, we'll just show a notification
  
  // Show confirmation message
  showNotification('Thank you for your message. We will respond shortly!');
  
  // Reset form
  contactForm.reset();
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
