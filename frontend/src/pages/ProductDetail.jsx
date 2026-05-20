import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, MessageSquare, Plus, Minus, AlertCircle } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  // Review states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState('');

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Product not found');
      setProduct(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError('');
    setReviewSuccess(false);

    try {
      const res = await fetch(`http://localhost:5000/api/products/${id}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ rating, comment }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }

      setReviewSuccess(true);
      setComment('');
      setRating(5);
      // Re-fetch product details to show new review & update rating
      fetchProductDetails();
    } catch (err) {
      setReviewError(err.message);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) {
    return (
      <div className="product-error container">
        <AlertCircle size={48} className="error-icon" />
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <Link to="/shop" className="back-btn">Back to Shop</Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page container animate-fade">
      {/* Product Split Details */}
      <div className="product-split">
        {/* Left Side: Image */}
        <div className="product-image-container">
          <img src={product.image} alt={product.name} className="product-main-image" />
        </div>

        {/* Right Side: Info */}
        <div className="product-info-container">
          <span className="product-category-tag">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>

          {/* Star Rating Overview */}
          <div className="rating-overview">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  fill={i < Math.round(product.rating) ? 'var(--color-accent)' : 'none'}
                  color={i < Math.round(product.rating) ? 'var(--color-accent)' : 'var(--color-border)'}
                />
              ))}
            </div>
            <span className="rating-text">
              {product.rating} ({product.numReviews} review{product.numReviews !== 1 ? 's' : ''})
            </span>
          </div>

          <p className="product-price">Rs. {product.price.toLocaleString()}</p>
          <p className="product-description">{product.description}</p>

          <div className="stock-status">
            <span>Availability: </span>
            <span className={`status-badge ${product.countInStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
              {product.countInStock > 0 ? `${product.countInStock} In Stock` : 'Out of Stock'}
            </span>
          </div>

          {/* Quantity Controls & Add to Cart */}
          {product.countInStock > 0 && (
            <div className="cart-action-panel">
              <div className="qty-picker">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span>{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.countInStock, qty + 1))}
                  disabled={qty >= product.countInStock}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                className="add-to-cart-large"
                onClick={() => addToCart(product, qty)}
              >
                ADD TO CART
              </button>
            </div>
          )}

          {product.countInStock === 0 && (
            <button className="add-to-cart-large out-of-stock-btn" disabled>
              OUT OF STOCK
            </button>
          )}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Customer Reviews</h2>

        <div className="reviews-split">
          {/* Reviews list */}
          <div className="reviews-list">
            {product.reviews.length === 0 ? (
              <p className="no-reviews">No reviews for this product yet. Be the first to share your thoughts!</p>
            ) : (
              product.reviews.map((rev) => (
                <div key={rev._id} className="review-item">
                  <div className="review-header">
                    <h4>{rev.name}</h4>
                    <span className="review-date">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div className="stars">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={14}
                        fill={i < rev.rating ? 'var(--color-accent)' : 'none'}
                        color={i < rev.rating ? 'var(--color-accent)' : 'var(--color-border)'}
                      />
                    ))}
                  </div>
                  <p className="review-comment">{rev.comment}</p>
                </div>
              ))
            )}
          </div>

          {/* Leave a review form */}
          <div className="leave-review-container">
            <h3>Write a Customer Review</h3>
            {user ? (
              <form onSubmit={handleReviewSubmit} className="review-form">
                {reviewSuccess && <p className="review-success">Review submitted successfully!</p>}
                {reviewError && <p className="review-error">{reviewError}</p>}

                <div className="form-group">
                  <label htmlFor="rating-select">Rating</label>
                  <select
                    id="rating-select"
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="form-control"
                  >
                    <option value="5">5 - Excellent</option>
                    <option value="4">4 - Very Good</option>
                    <option value="3">3 - Good</option>
                    <option value="2">2 - Fair</option>
                    <option value="1">1 - Poor</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="comment-text">Review Comment</label>
                  <textarea
                    id="comment-text"
                    rows="4"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="form-control"
                    placeholder="Describe your experience with this product..."
                  />
                </div>

                <button type="submit" className="submit-review-btn">
                  SUBMIT REVIEW
                </button>
              </form>
            ) : (
              <div className="login-to-review">
                <MessageSquare size={32} className="review-placeholder-icon" />
                <p>Please log in to share your review.</p>
                <Link to="/login" className="login-link-btn">
                  SIGN IN
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
