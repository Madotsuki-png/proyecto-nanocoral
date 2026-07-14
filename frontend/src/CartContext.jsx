import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarAlCarrito = (producto) => {
    setCarrito([...carrito, producto]);
    alert(`${producto.nombre} agregado al carrito`);
  };

  return (
    <CartContext.Provider value={{ carrito, agregarAlCarrito, setCarrito }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
