import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { ShoppingBag, CreditCard, Truck, ChevronRight } from 'lucide-react';
import './Checkout.css';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const { cartItems, itemsPrice, shippingPrice, totalPrice, clearCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Shipping state
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' or 'EasyPaisa'
  const [trxId, setTrxId] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');

  // Check login
  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout');
    }
  }, [user, navigate]);

  // Check empty cart
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/shop');
    }
  }, [cartItems, navigate]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (paymentMethod === 'EasyPaisa' && !trxId.trim()) {
      setError('Please provide your EasyPaisa Transaction ID for verification.');
      return;
    }

    setPlacingOrder(true);

    const orderData = {
      orderItems: cartItems,
      shippingAddress: { address, city, postalCode, phone },
      paymentMethod,
      paymentDetails: paymentMethod === 'EasyPaisa' ? { transactionId: trxId } : {},
      itemsPrice,
      shippingPrice,
      totalPrice,
    };

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to place order');
      }

      // Success
      clearCart();
      navigate(`/orders/${data._id}`);
    } catch (err) {
      setError(err.message || 'Something went wrong while placing your order.');
    } finally {
      setPlacingOrder(false);
    }
  };

  return (
    <div className="checkout-page container animate-fade">
      {/* Checkout layout */}
      <div className="checkout-grid">
        {/* Left Side: Forms */}
        <form onSubmit={handlePlaceOrder} className="checkout-forms">
          {/* Shipping section */}
          <div className="checkout-section-card">
            <div className="section-title-icon">
              <Truck size={18} className="sec-icon" />
              <h2>Shipping Address</h2>
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Street Address</label>
              <input
                type="text"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                className="form-control"
                placeholder="Apartment, suite, street name"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  className="form-control"
                  placeholder="e.g. Lahore"
                />
              </div>

              <div className="form-group">
                <label htmlFor="postal">Postal Code</label>
                <input
                  type="text"
                  id="postal"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  required
                  className="form-control"
                  placeholder="e.g. 54000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="form-control"
                placeholder="e.g. 03001234567"
              />
            </div>
          </div>

          {/* Payment section */}
          <div className="checkout-section-card">
            <div className="section-title-icon">
              <CreditCard size={18} className="sec-icon" />
              <h2>Payment Method</h2>
            </div>

            <div className="payment-options">
              {/* COD Option */}
              <label className={`payment-option-label ${paymentMethod === 'COD' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={() => setPaymentMethod('COD')}
                />
                <div className="option-info">
                  <h3>Cash on Delivery (COD)</h3>
                  <p>Pay with cash upon package delivery.</p>
                </div>
              </label>

              {/* EasyPaisa Option */}
              <label className={`payment-option-label ${paymentMethod === 'EasyPaisa' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="EasyPaisa"
                  checked={paymentMethod === 'EasyPaisa'}
                  onChange={() => setPaymentMethod('EasyPaisa')}
                />
                <div className="option-info">
                  <h3>EasyPaisa</h3>
                  <p>Transfer directly to our account and submit Transaction ID.</p>
                </div>
              </label>
            </div>

            {/* EasyPaisa Instructions Box */}
            {paymentMethod === 'EasyPaisa' && (
              <div className="easypaisa-instructions animate-fade">
                <h4>EasyPaisa Transfer Details:</h4>
                <ol className="instructions-list">
                  <li>Transfer total amount of <strong>Rs. {totalPrice.toLocaleString()}</strong> to the following account:</li>
                  <ul className="account-details">
                    <li>EasyPaisa Number: <strong>0300-1234567</strong></li>
                    <li>Account Title: <strong>Elegant Fashion Brand</strong></li>
                  </ul>
                  <li>Once transferred, paste the <strong>Transaction ID (TRX ID)</strong> from your confirmation SMS/App below:</li>
                </ol>

                <div className="form-group trx-id-group">
                  <label htmlFor="trxId">Transaction ID (TRX ID)</label>
                  <input
                    type="text"
                    id="trxId"
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    required
                    className="form-control"
                    placeholder="Enter 11-digit Transaction ID"
                  />
                </div>
              </div>
            )}
          </div>

          {error && <div className="checkout-error">{error}</div>}

          <button type="submit" disabled={placingOrder} className="place-order-btn">
            {placingOrder ? 'PROCESSING ORDER...' : 'PLACE ORDER'}
          </button>
        </form>

        {/* Right Side: Order Summary */}
        <div className="checkout-summary-panel">
          <div className="section-title-icon">
            <ShoppingBag size={18} className="sec-icon" />
            <h2>Order Summary</h2>
          </div>

          <div className="summary-items-list">
            {cartItems.map((item) => (
              <div key={item.product} className="summary-item-row">
                <img src={item.image} alt={item.name} className="summary-item-img" />
                <div className="summary-item-details">
                  <h3>{item.name}</h3>
                  <p className="summary-qty-price">
                    Qty: {item.qty} &bull; Rs. {item.price.toLocaleString()}
                  </p>
                </div>
                <span className="summary-row-total">
                  Rs. {(item.qty * item.price).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="summary-totals">
            <div className="total-row-item">
              <span>Subtotal</span>
              <span>Rs. {itemsPrice.toLocaleString()}</span>
            </div>
            <div className="total-row-item">
              <span>Shipping Fee</span>
              <span>{shippingPrice === 0 ? 'FREE' : `Rs. ${shippingPrice}`}</span>
            </div>
            <div className="total-row-item grand-total">
              <span>Grand Total</span>
              <span>Rs. {totalPrice.toLocaleString()}</span>
            </div>
          </div>

          <div className="secure-checkout-tag">
            <span className="bullet">&bull;</span> Nationwide delivery with tracking.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
