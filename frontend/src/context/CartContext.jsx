import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (err) {
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save to localStorage when changed
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existItem = prevItems.find((item) => item.product === product._id);

      if (existItem) {
        // Limit quantity to stock
        const newQty = Math.min(existItem.qty + qty, product.countInStock);
        return prevItems.map((item) =>
          item.product === product._id ? { ...item, qty: newQty } : item
        );
      } else {
        return [
          ...prevItems,
          {
            product: product._id,
            name: product.name,
            image: product.image,
            price: product.price,
            countInStock: product.countInStock,
            qty,
          },
        ];
      }
    });
    // Open drawer to give instant visual feedback!
    setCartDrawerOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.product !== id));
  };

  const updateQty = (id, qty) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product === id ? { ...item, qty: Math.max(1, qty) } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 5000 || itemsPrice === 0 ? 0 : 200; // Free above Rs. 5000
  const totalPrice = itemsPrice + shippingPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartDrawerOpen,
        setCartDrawerOpen,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        itemsPrice,
        shippingPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
