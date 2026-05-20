import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container container">
        {/* Brand Column */}
        <div className="footer-col brand-col">
          <h3>ELEGANT FASHION</h3>
          <p className="brand-desc">
            Redefining modern luxury. Handcrafted accessories, footwear, and apparel designed for the sophisticated lifestyle.
          </p>
          <div className="contact-info">
            <p><MapPin size={16} /> Gulberg III, Lahore, Pakistan</p>
            <p><Phone size={16} /> +92 (300) 123-4567</p>
            <p><Mail size={16} /> info@elegantfashion.com</p>
          </div>
        </div>

        {/* Links Column */}
        <div className="footer-col">
          <h4>Explore</h4>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/shop">Shop All Products</Link></li>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/contact">Get in Touch</Link></li>
          </ul>
        </div>

        {/* Customer Support Column */}
        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul className="footer-links">
            <li><a href="#faq">FAQs</a></li>
            <li><a href="#shipping">Shipping & Returns</a></li>
            <li><a href="#terms">Terms of Service</a></li>
            <li><a href="#privacy">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className="footer-col newsletter-col">
          <h4>Join the Club</h4>
          <p>Subscribe to receive exclusive offers, early access, and style updates.</p>
          {subscribed ? (
            <p className="subscribe-success">Thank you for subscribing to our updates!</p>
          ) : (
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="newsletter-input"
              />
              <button type="submit" className="newsletter-btn">
                JOIN
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-container">
          <p>&copy; {new Date().getFullYear()} ELEGANT FASHION. All Rights Reserved.</p>
          <p className="payments-accepted">COD | EasyPaisa</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
