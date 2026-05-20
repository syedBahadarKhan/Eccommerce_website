import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems, setCartDrawerOpen } = useContext(CartContext);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <nav className="navbar">
      <div className="navbar-container container">
        {/* Brand Logo */}
        <Link to="/" className="navbar-logo" onClick={() => setMobileOpen(false)}>
          ELEGANT FASHION
        </Link>

        {/* Desktop Menu */}
        <ul className={`navbar-links ${mobileOpen ? 'active' : ''}`}>
          <li>
            <Link to="/" onClick={() => setMobileOpen(false)}>Home</Link>
          </li>
          <li>
            <Link to="/shop" onClick={() => setMobileOpen(false)}>Shop</Link>
          </li>
          <li>
            <Link to="/about" onClick={() => setMobileOpen(false)}>About</Link>
          </li>
          <li>
            <Link to="/contact" onClick={() => setMobileOpen(false)}>Contact</Link>
          </li>
        </ul>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          {/* Cart Icon */}
          <button
            className="navbar-action-btn cart-btn"
            onClick={() => setCartDrawerOpen(true)}
            aria-label="Open Cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>

          {/* User Section */}
          {user ? (
            <div className="user-dropdown-container">
              <button
                className="navbar-action-btn user-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                aria-label="User menu"
              >
                <User size={20} />
                <span className="user-name-desktop">{user.name.split(' ')[0]}</span>
              </button>
              {dropdownOpen && (
                <div className="user-dropdown-menu">
                  {user.isAdmin && (
                    <Link
                      to="/admin"
                      className="dropdown-item"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <LayoutDashboard size={16} /> Admin Panel
                    </Link>
                  )}
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setDropdownOpen(false)}
                  >
                    <User size={16} /> Profile
                  </Link>
                  <button className="dropdown-item logout-btn" onClick={handleLogout}>
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="navbar-login-btn">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="navbar-mobile-toggle"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
