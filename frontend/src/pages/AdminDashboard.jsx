import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Plus, Edit, Trash2, Box, ShoppingBag } from 'lucide-react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'orders'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Edit product state
  const [isEditing, setIsEditing] = useState(false);
  const [editProduct, setEditProduct] = useState({
    _id: '',
    name: '',
    price: 0,
    category: '',
    countInStock: 0,
    description: '',
    image: '',
    isFeatured: false,
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch products
        const prodRes = await fetch('http://localhost:5000/api/products');
        const prodData = await prodRes.json();
        setProducts(prodData);

        // Fetch orders
        const ordRes = await fetch('http://localhost:5000/api/orders', {
          headers: { Authorization: `Bearer ${user.token}` }
        });
        const ordData = await ordRes.json();
        setOrders(ordData);
      } catch (err) {
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await fetch(`http://localhost:5000/api/products/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${user.token}` }
        });
        if (res.ok) {
          setProducts(products.filter(p => p._id !== id));
        } else {
          alert('Failed to delete product');
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setIsEditing(true);
  };

  const handleCreateNew = () => {
    setEditProduct({
      _id: '',
      name: '',
      price: 0,
      category: '',
      countInStock: 0,
      description: '',
      image: '',
      isFeatured: false,
    });
    setIsEditing(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const isNew = !editProduct._id;
      const url = isNew 
        ? 'http://localhost:5000/api/products' 
        : `http://localhost:5000/api/products/${editProduct._id}`;
      
      const res = await fetch(url, {
        method: isNew ? 'POST' : 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}` 
        },
        body: JSON.stringify(editProduct)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      if (isNew) {
        setProducts([data, ...products]);
      } else {
        setProducts(products.map(p => (p._id === editProduct._id ? data : p)));
      }
      setIsEditing(false);
    } catch (err) {
      alert(`Error saving product: ${err.message}`);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const res = await fetch('http://localhost:5000/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: formData,
      });
      
      if (!res.ok) {
        throw new Error('Image upload failed');
      }

      const data = await res.text();
      // data is something like "/uploads/image-123.jpg"
      setEditProduct({ ...editProduct, image: `http://localhost:5000${data}` });
    } catch (err) {
      console.error(err);
      alert(err.message || 'Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="spinner" />;

  return (
    <div className="admin-dashboard-page container animate-fade">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage store inventory and fulfill customer orders.</p>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="admin-tabs">
        <button 
          className={`admin-tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Box size={18} /> Products Management
        </button>
        <button 
          className={`admin-tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          <ShoppingBag size={18} /> Orders Overview
        </button>
      </div>

      <div className="admin-content-area">
        {activeTab === 'products' && (
          <div className="products-panel">
            <div className="panel-header">
              <h2>Inventory</h2>
              <button className="btn-primary flex-btn" onClick={handleCreateNew}>
                <Plus size={16} /> Add Product
              </button>
            </div>

            {isEditing ? (
              <div className="admin-edit-form-card">
                <h3>{editProduct._id ? 'Edit Product' : 'Create New Product'}</h3>
                <form onSubmit={handleSaveProduct} className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Name</label>
                      <input type="text" value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Price (Rs.)</label>
                      <input type="number" value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})} required className="form-control" />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <input type="text" value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value})} required className="form-control" />
                    </div>
                    <div className="form-group">
                      <label>Stock Count</label>
                      <input type="number" value={editProduct.countInStock} onChange={e => setEditProduct({...editProduct, countInStock: Number(e.target.value)})} required className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Image URL</label>
                    <input type="text" value={editProduct.image} onChange={e => setEditProduct({...editProduct, image: e.target.value})} required className="form-control" />
                    <input type="file" onChange={uploadFileHandler} className="form-control" style={{ marginTop: '10px' }} />
                    {uploading && <p style={{ fontSize: '0.85rem', color: 'var(--color-accent)', marginTop: '8px' }}>Uploading image...</p>}
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea value={editProduct.description} onChange={e => setEditProduct({...editProduct, description: e.target.value})} rows="3" required className="form-control" />
                  </div>
                  <div className="form-group checkbox-group">
                    <input type="checkbox" id="isFeatured" checked={editProduct.isFeatured} onChange={e => setEditProduct({...editProduct, isFeatured: e.target.checked})} />
                    <label htmlFor="isFeatured">Feature on Home Page</label>
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="btn-primary">Save Product</button>
                    <button type="button" className="btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="table-responsive">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>NAME</th>
                      <th>PRICE</th>
                      <th>CATEGORY</th>
                      <th>STOCK</th>
                      <th>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => (
                      <tr key={product._id}>
                        <td>{product._id.substring(18)}</td>
                        <td>{product.name}</td>
                        <td>Rs. {product.price.toLocaleString()}</td>
                        <td>{product.category}</td>
                        <td>
                          <span className={product.countInStock > 0 ? 'text-success' : 'text-danger'}>
                            {product.countInStock}
                          </span>
                        </td>
                        <td className="action-cells">
                          <button className="action-btn edit" onClick={() => handleEditClick(product)} title="Edit"><Edit size={16} /></button>
                          <button className="action-btn delete" onClick={() => handleDeleteProduct(product._id)} title="Delete"><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-panel">
            <div className="panel-header">
              <h2>Customer Orders</h2>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>CUSTOMER</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th>METHOD</th>
                    <th>DETAILS</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(18)}</td>
                      <td>{order.user?.name || 'Deleted User'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>Rs. {order.totalPrice.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${order.isPaid ? 'badge-paid' : 'badge-pending'}`}>
                          {order.isPaid ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${order.isDelivered ? 'badge-delivered' : 'badge-pending'}`}>
                          {order.isDelivered ? 'Yes' : 'No'}
                        </span>
                      </td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <button className="btn-secondary small" onClick={() => navigate(`/orders/${order._id}`)}>View</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
