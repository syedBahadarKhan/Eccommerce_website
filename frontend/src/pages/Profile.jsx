import React, { useState, useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingBag, User as UserIcon, Calendar, ArrowRight } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, updateProfile } = useContext(AuthContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  useEffect(() => {
    const fetchMyOrders = async () => {
      if (!user) return;
      try {
        const res = await fetch('http://localhost:5000/api/orders/myorders', {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        });
        const data = await res.json();
        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error('Invalid orders data:', data);
          setOrders([]);
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess(false);

    if (password && password !== confirmPassword) {
      setUpdateError('Passwords do not match');
      return;
    }

    setUpdating(true);
    try {
      await updateProfile({ name, email, password });
      setUpdateSuccess(true);
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      setUpdateError(err.message || 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  };

  if (!user) {
    return (
      <div className="profile-page container text-center animate-fade">
        <p style={{ padding: '60px 0' }}>Please log in to view your profile.</p>
        <Link to="/login" className="btn-primary">SIGN IN</Link>
      </div>
    );
  }

  return (
    <div className="profile-page container animate-fade">
      <div className="profile-grid">
        {/* Left Side: Update Profile */}
        <div className="profile-card">
          <div className="card-header-with-icon">
            <UserIcon size={20} className="card-header-icon" />
            <h2>User Profile</h2>
          </div>
          <p className="card-subtitle">Manage your personal settings</p>

          {updateSuccess && <p className="success-banner">Profile updated successfully!</p>}
          {updateError && <p className="error-banner">{updateError}</p>}

          <form onSubmit={handleUpdate} className="profile-form">
            <div className="form-group">
              <label htmlFor="profile-name">Name</label>
              <input
                type="text"
                id="profile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-email">Email Address</label>
              <input
                type="email"
                id="profile-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-pass">New Password (leave blank to keep current)</label>
              <input
                type="password"
                id="profile-pass"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-control"
                placeholder="New password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="profile-confirm">Confirm Password</label>
              <input
                type="password"
                id="profile-confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="form-control"
                placeholder="Confirm password"
              />
            </div>

            <button type="submit" disabled={updating} className="profile-submit-btn">
              {updating ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
            </button>
          </form>
        </div>

        {/* Right Side: Order History */}
        <div className="orders-card">
          <div className="card-header-with-icon">
            <ShoppingBag size={20} className="card-header-icon" />
            <h2>Order History</h2>
          </div>
          <p className="card-subtitle">View details of your recent orders</p>

          {ordersLoading ? (
            <div className="spinner" />
          ) : orders.length === 0 ? (
            <div className="no-orders-box">
              <ShoppingBag size={32} className="no-orders-icon" />
              <p>You have not placed any orders yet.</p>
              <Link to="/shop" className="start-shopping-link">
                START SHOPPING
              </Link>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div key={order._id} className="order-history-item">
                  <div className="order-item-meta">
                    <div className="order-meta-left">
                      <span className="order-date">
                        <Calendar size={12} className="meta-icon" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                      <span className="order-id">ID: #{order._id.substring(12)}</span>
                    </div>
                    <span className="order-price">Rs. {order.totalPrice.toLocaleString()}</span>
                  </div>

                  <div className="order-item-statuses">
                    <span className={`badge ${order.isPaid ? 'badge-paid' : 'badge-pending'}`}>
                      {order.isPaid ? 'Paid' : 'Unpaid'}
                    </span>
                    <span className={`badge ${order.isDelivered ? 'badge-delivered' : 'badge-pending'}`}>
                      {order.isDelivered ? 'Delivered' : 'Pending'}
                    </span>
                  </div>

                  <Link to={`/orders/${order._id}`} className="view-order-link">
                    View Details & Invoice <ArrowRight size={12} />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
