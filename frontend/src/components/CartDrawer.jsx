import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import './CartDrawer.css';

const CartDrawer = () => {
  const {
    cartItems,
    cartDrawerOpen,
    setCartDrawerOpen,
    removeFromCart,
    updateQty,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = useContext(CartContext);
  const navigate = useNavigate();

  if (!cartDrawerOpen) return null;

  const handleCheckout = () => {
    setCartDrawerOpen(false);
    navigate('/checkout');
  };

  return (
    <div className="cart-drawer-overlay" onClick={() => setCartDrawerOpen(false)}>
      <div className="cart-drawer-content" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <h3>YOUR CART ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</h3>
          <button onClick={() => setCartDrawerOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-body">
          {cartItems.length === 0 ? (
            <div className="empty-cart-message">
              <ShoppingBag size={48} className="empty-icon" />
              <p>Your shopping cart is empty.</p>
              <button
                className="continue-btn"
                onClick={() => {
                  setCartDrawerOpen(false);
                  navigate('/shop');
                }}
              >
                DISCOVER COLLECTIONS
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div key={item.product} className="cart-drawer-item">
                  <img src={item.image} alt={item.name} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">Rs. {item.price.toLocaleString()}</p>
                    <div className="cart-qty-controls">
                      <button
                        onClick={() => updateQty(item.product, item.qty - 1)}
                        disabled={item.qty <= 1}
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span>{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.product, item.qty + 1)}
                        disabled={item.qty >= item.countInStock}
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-item-btn"
                    onClick={() => removeFromCart(item.product)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-row">
              <span>Subtotal</span>
              <span>Rs. {itemsPrice.toLocaleString()}</span>
            </div>
            <div className="cart-summary-row">
              <span>Shipping</span>
              <span>{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}</span>
            </div>
            <div className="cart-summary-row total-row">
              <span>Estimated Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              PROCEED TO CHECKOUT
            </button>
            <button className="continue-shopping-btn" onClick={() => setCartDrawerOpen(false)}>
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
