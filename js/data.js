// Product data
const products = [
    {
      id: 1,
      name: "Wireless Bluetooth Headphones",
      description: "Premium noise-cancelling headphones with deep bass and crystal clear sound.",
      price: 149.99,
      image: "multimedia/img0.jpg",
      category: "electronics",
      featured: true,
      inStock: true,
      rating: 4.5,
      reviews: 128
    },
    {
      id: 2,
      name: "Smartphone X Pro",
      description: "Flagship smartphone with high-resolution camera and all-day battery life.",
      price: 899.99,
      image: "multimedia/img1.jpg",
      category: "electronics",
      featured: true,
      inStock: true,
      rating: 4.8,
      reviews: 256
    },
    {
      id: 3,
      name: "Laptop Ultra Slim",
      description: "Lightweight laptop with powerful performance for work and entertainment.",
      price: 1299.99,
      image: "multimedia/img2.jpg",
      category: "electronics",
      featured: true,
      inStock: true,
      rating: 4.7,
      reviews: 192
    },
    {
      id: 4,
      name: "Smartwatch Fitness Tracker",
      description: "Track your activity, sleep, and heart rate with this stylish smartwatch.",
      price: 129.99,
      image: "multimedia/img3.jpg",
      category: "electronics",
      featured: false,
      inStock: true,
      rating: 4.3,
      reviews: 87
    },
    {
      id: 5,
      name: "Wireless Earbuds",
      description: "Truly wireless earbuds with premium sound quality and long battery life.",
      price: 89.99,
      image: "multimedia/img4.jpg",
      category: "electronics",
      featured: false,
      inStock: true,
      rating: 4.4,
      reviews: 112
    },
    {
      id: 6,
      name: "4K Smart TV",
      description: "Ultra HD smart TV with streaming apps and voice control.",
      price: 699.99,
      image: "multimedia/img5.jpg",
      category: "electronics",
      featured: true,
      inStock: true,
      rating: 4.6,
      reviews: 143
    },
    {
      id: 7,
      name: "Digital Camera Pro",
      description: "Professional-grade digital camera with 4K video recording.",
      price: 799.99,
      image: "multimedia/img6.jpg",
      category: "electronics",
      featured: false,
      inStock: true,
      rating: 4.7,
      reviews: 98
    },
    {
      id: 8,
      name: "Portable Bluetooth Speaker",
      description: "Waterproof portable speaker with 360-degree sound.",
      price: 79.99,
      image: "multimedia/img7.jpg",
      category: "electronics",
      featured: false,
      inStock: true,
      rating: 4.2,
      reviews: 76
    }
  ];
  
  // Function to get featured products
  function getFeaturedProducts() {
    return products.filter(product => product.featured);
  }
  
  // Function to get a product by ID
  function getProductById(id) {
    return products.find(product => product.id === Number(id));
  }
  
  // Function to get related products (excluding the current product)
  function getRelatedProducts(currentProductId) {
    return products
      .filter(product => product.id !== Number(currentProductId))
      .sort(() => 0.5 - Math.random())
      .slice(0, 4);
  }
  
  // Function to format price
  function formatPrice(price) {
    return price.toFixed(2);
  }