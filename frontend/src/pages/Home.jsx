import React, { useEffect, useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Heart, ArrowRight, Star } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './Home.css';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/products/featured');
        const data = await res.json();
        setFeaturedProducts(data.slice(0, 4)); // Get first 4
      } catch (err) {
        console.error('Failed to fetch featured products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const testimonials = [
    {
      name: 'Kamran Shah',
      role: 'Fashion Consultant',
      text: 'Elegant Fashion offers exceptional premium products. The watch I ordered is stunning and the leather is top notch.',
      rating: 5,
    },
    {
      name: 'Dr. Ayesha Malik',
      role: 'Regular Customer',
      text: 'I love their minimal aesthetic. Shipping was incredibly fast, and customer service on WhatsApp resolved my query instantly!',
      rating: 5,
    },
  ];

  return (
    <div className="home-page animate-fade">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container container">
          <div className="hero-text-content">
            <h1 className="hero-title">
              Discover <br />
              <span className="serif-italic">Luxury</span> Collections
            </h1>
            <p className="hero-subtitle">Premium Fashion for Every Style</p>
            <Link to="/shop" className="hero-cta-btn">
              SHOP NOW <ArrowRight size={16} />
            </Link>
          </div>
          <div className="hero-image-content">
            {/* Overlay styled to feel luxurious, similar to the warm lighting look of the mockup */}
            <img
              src="https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800"
              alt="Luxury bag and fashion accessories"
              className="hero-main-img"
            />
            <div className="hero-light-beam"></div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="featured-section">
        <div className="container">
          <div className="featured-header">
            <h2>Featured Products</h2>
            <Link to="/shop" className="view-all-link">
              View All <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="spinner" />
          ) : (
            <div className="products-grid">
              {featuredProducts.length === 0 ? (
                <p>No products featured currently.</p>
              ) : (
                featuredProducts.map((product) => (
                  <div key={product._id} className="product-card">
                    <Link to={`/products/${product._id}`} className="card-image-wrapper">
                      <img src={product.image} alt={product.name} className="product-card-img" />
                    </Link>
                    <div className="product-card-info">
                      <div className="card-meta">
                        <Link to={`/products/${product._id}`}>
                          <h3 className="product-card-name">{product.name}</h3>
                        </Link>
                        <p className="product-card-price">Rs. {product.price.toLocaleString()}</p>
                      </div>
                      <div className="card-actions">
                        <button
                          className="add-to-cart-quick"
                          onClick={() => addToCart(product, 1)}
                        >
                          + ADD TO CART
                        </button>
                        <button className="wishlist-btn" aria-label="Add to Wishlist">
                          <Heart size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title-center">What Our Clients Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((t, index) => (
              <div key={index} className="testimonial-card">
                <div className="stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-accent)" color="var(--color-accent)" />
                  ))}
                </div>
                <p className="testimonial-text">"{t.text}"</p>
                <h4 className="testimonial-name">{t.name}</h4>
                <p className="testimonial-role">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
