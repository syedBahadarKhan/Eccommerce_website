const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const chatbotRoutes = require('./routes/chatbotRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const path = require('path');

// Load models for seeding
const User = require('./models/User');
const Product = require('./models/Product');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/chat', chatbotRoutes);
app.use('/api/upload', uploadRoutes);

// Make uploads folder static
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// Root route
app.get('/', (req, res) => {
  res.send('Elegant Fashion API is running...');
});

// Seeding function
const seedDatabase = async () => {
  try {
    // 1. Check/Seed Admin User
    const adminExists = await User.findOne({ email: 'admin@elegant.com' });
    if (!adminExists) {
      await User.create({
        name: 'Elegant Admin',
        email: 'admin@elegant.com',
        password: 'adminpassword123', // Will be hashed by UserSchema pre-save
        isAdmin: true,
      });
      console.log('Seeded Admin User (admin@elegant.com / adminpassword123)');
    }

    // 2. Check/Seed Sample Products
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      const sampleProducts = [
        {
          name: "Men's Sneakers",
          description: "Premium sports sneakers with advanced cushioning and modern sleek styling. Perfect for everyday luxury comfort.",
          price: 12999,
          category: "Shoes",
          image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600",
          countInStock: 15,
          isFeatured: true,
          rating: 4.8,
          numReviews: 2,
          reviews: [
            { name: "Haris Khan", rating: 5, comment: "Super comfortable and they look even better in real life!" },
            { name: "Sara Ahmed", rating: 4.5, comment: "Excellent build quality, highly recommended." }
          ]
        },
        {
          name: "Luxury Chronograph Watch",
          description: "Precision craftsmanship timepiece featuring a genuine black leather strap, stainless steel casing, and water-resistance. Elegance redefined.",
          price: 24999,
          category: "Accessories",
          image: "https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?q=80&w=600",
          countInStock: 8,
          isFeatured: true,
          rating: 4.9,
          numReviews: 1,
          reviews: [
            { name: "Ali Raza", rating: 5, comment: "Pure class. Got so many compliments already." }
          ]
        },
        {
          name: "Minimalist Leather Tote Bag",
          description: "Genuine grain leather handbag handcrafted with double stitching, internal compartments, and gold accent buckles. Roomy and chic.",
          price: 17999,
          category: "Bags",
          image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=600",
          countInStock: 5,
          isFeatured: true,
          rating: 4.7,
          numReviews: 1,
          reviews: [
            { name: "Zainab Bibi", rating: 5, comment: "Stunning quality leather. Worth every rupee." }
          ]
        },
        {
          name: "Wireless ANC Headphones",
          description: "Studio-quality acoustic headset with active noise cancellation, 40-hour battery life, and plush memory foam earcups.",
          price: 9999,
          category: "Electronics",
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600",
          countInStock: 20,
          isFeatured: true,
          rating: 4.6,
          numReviews: 1,
          reviews: [
            { name: "Usman Ghani", rating: 4, comment: "Noise cancellation is amazing, bass is punchy." }
          ]
        }
      ];

      await Product.insertMany(sampleProducts);
      console.log('Seeded 4 default products successfully!');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/elegant-fashion';

mongoose
  .connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB successfully!');
    await seedDatabase();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection failed. Starting server in Offline/Mock mode...', err.message);
    
    // Fallback: Start the express server even if MongoDB is not running, so that
    // the system is testable or behaves gracefully instead of crashing!
    app.listen(PORT, () => {
      console.log(`Server (Offline/Mock Mode) is running on port ${PORT}`);
    });
  });
