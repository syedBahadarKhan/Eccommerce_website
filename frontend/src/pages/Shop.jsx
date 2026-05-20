import React, { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './Shop.css';

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const { addToCart } = useContext(CartContext);

  const categories = ['All', 'Shoes', 'Accessories', 'Bags', 'Electronics'];

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `http://localhost:5000/api/products?category=${activeCategory}`;
        if (searchTerm) {
          url += `&keyword=${searchTerm}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };

    // Debounce product fetches slightly for search bar
    const timeout = setTimeout(fetchProducts, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, activeCategory]);

  return (
    <div className="shop-page container animate-fade">
      {/* Header section */}
      <div className="shop-header">
        <h1 className="shop-title">Discover Our Collections</h1>
        <p className="shop-subtitle">Unmatched premium styles tailored for you</p>
      </div>

      {/* Filter and Search Panel */}
      <div className="shop-controls">
        {/* Category filters */}
        <div className="category-filters">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search bar */}
        <div className="search-bar-container">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="spinner" />
      ) : (
        <div className="shop-products-section">
          {products.length === 0 ? (
            <div className="no-products-message">
              <p>No products found matching your search criteria.</p>
              <button
                className="reset-filters-btn"
                onClick={() => {
                  setSearchTerm('');
                  setActiveCategory('All');
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="shop-products-grid">
              {products.map((product) => (
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
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Shop;
