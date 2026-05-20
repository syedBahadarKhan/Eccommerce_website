import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CreditCard, MapPin, Package, CheckCircle, Clock } from 'lucide-react';
import './OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Admin button loaders
  const [payLoading, setPayLoading] = useState(false);
  const [deliverLoading, setDeliverLoading] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch order details');
      }
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchOrderDetails();
    }
  }, [id, user]);

  const handleMarkAsPaid = async () => {
    setPayLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrder(data);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setPayLoading(false);
    }
  };

  const handleMarkAsDelivered = async () => {
    setDeliverLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/orders/${id}/deliver`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setOrder(data);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setDeliverLoading(false);
    }
  };

  if (loading) return <div className="spinner" />;
  if (error) {
    return (
      <div className="order-error container text-center animate-fade" style={{ padding: '80px 0' }}>
        <h2>Order Not Found</h2>
        <p>{error}</p>
        <Link to="/profile" className="btn-primary" style={{ marginTop: '20px', display: 'inline-block' }}>
          Back to Profile
        </Link>
      </div>
    );
  }

  return (
    <div className="order-details-page container animate-fade">
      {/* Title */}
      <div className="order-details-header">
        <h1>Order Invoice</h1>
        <p className="order-details-id">Order ID: #{order._id}</p>
      </div>

      <div className="order-details-grid">
        {/* Left column: Info Cards */}
        <div className="order-info-cards">
          {/* Shipping status */}
          <div className="info-card">
            <div className="info-card-header">
              <MapPin size={18} className="info-icon" />
              <h3>Shipping Information</h3>
            </div>
            <div className="info-card-body">
              <p><strong>Customer Name:</strong> {order.user?.name}</p>
              <p><strong>Email Address:</strong> {order.user?.email}</p>
              <p>
                <strong>Delivery Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
              
              <div className={`status-alert ${order.isDelivered ? 'success' : 'pending'}`}>
                {order.isDelivered ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Delivered on {new Date(order.deliveredAt).toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} />
                    <span>Pending Dispatch</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment status */}
          <div className="info-card">
            <div className="info-card-header">
              <CreditCard size={18} className="info-icon" />
              <h3>Payment Method</h3>
            </div>
            <div className="info-card-body">
              <p><strong>Selected Method:</strong> {order.paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'EasyPaisa'}</p>
              
              {order.paymentMethod === 'EasyPaisa' && (
                <div className="easypaisa-verification-details">
                  <p><strong>Transaction ID (TRX):</strong> <code>{order.paymentDetails?.transactionId}</code></p>
                  {!order.isPaid && (
                    <p className="admin-note">
                      * Our team is currently verifying this Transaction ID. Your order will be dispatched once verified.
                    </p>
                  )}
                </div>
              )}

              <div className={`status-alert ${order.isPaid ? 'success' : 'pending'}`}>
                {order.isPaid ? (
                  <>
                    <CheckCircle size={16} />
                    <span>Paid on {new Date(order.paidAt).toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <Clock size={16} />
                    <span>Awaiting Payment Verification</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="info-card">
            <div className="info-card-header">
              <Package size={18} className="info-icon" />
              <h3>Items List</h3>
            </div>
            <div className="info-card-body p-0">
              <div className="invoice-items-list">
                {order.orderItems.map((item) => (
                  <div key={item.product} className="invoice-item-row">
                    <img src={item.image} alt={item.name} className="invoice-item-img" />
                    <div className="invoice-item-details">
                      <h4>
                        <Link to={`/products/${item.product}`}>{item.name}</Link>
                      </h4>
                      <p>
                        Rs. {item.price.toLocaleString()} x {item.qty}
                      </p>
                    </div>
                    <span className="invoice-item-total">
                      Rs. {(item.price * item.qty).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column: Invoice summary & Admin Controls */}
        <div className="order-summary-sidebar">
          <div className="summary-card">
            <h3>Invoice Summary</h3>
            <div className="invoice-summary-totals">
              <div className="summary-row">
                <span>Items Subtotal</span>
                <span>Rs. {order.itemsPrice.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Shipping & Handling</span>
                <span>{order.shippingPrice === 0 ? 'FREE' : `Rs. ${order.shippingPrice}`}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total Amount Due</span>
                <span>Rs. {order.totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Admin Management Panel */}
          {user?.isAdmin && (
            <div className="admin-actions-card animate-fade">
              <h3>Admin Management Panel</h3>
              <p className="admin-panel-subtitle">Review verification details and update statuses</p>
              
              <div className="admin-btn-group">
                {/* Pay button */}
                <button
                  onClick={handleMarkAsPaid}
                  disabled={order.isPaid || payLoading}
                  className={`admin-action-btn pay ${order.isPaid ? 'disabled' : ''}`}
                >
                  {payLoading ? 'UPDATING...' : order.isPaid ? 'ORDER IS PAID' : 'MARK AS PAID'}
                </button>

                {/* Deliver button */}
                <button
                  onClick={handleMarkAsDelivered}
                  disabled={order.isDelivered || deliverLoading}
                  className={`admin-action-btn deliver ${order.isDelivered ? 'disabled' : ''}`}
                >
                  {deliverLoading ? 'UPDATING...' : order.isDelivered ? 'ORDER IS DELIVERED' : 'MARK AS DELIVERED'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
