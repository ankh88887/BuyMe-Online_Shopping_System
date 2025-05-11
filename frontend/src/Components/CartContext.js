import React, { createContext, useState } from "react";

// Create the CartContext
export const CartContext = createContext();

// Create the CartProvider component
export const CartProvider = ({ children }) => {
  // Initialize cart items state
  const [cartItems, setCartItems] = useState([]);

  // Context value to be provided
  const contextValue = {
    cartItems,
    setCartItems,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};