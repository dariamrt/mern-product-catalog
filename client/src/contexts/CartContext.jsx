import { createContext, useState, useContext } from 'react';
import { OrderService } from '../services';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(p => p._id === product._id);
      if (existing) return prev.map(p => p._id === product._id ? {...p, quantity: p.quantity+1} : p);
      return [...prev, {...product, quantity: 1}];
    });
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(p => p._id !== id));
  };

  const clearCart = () => setCartItems([]);
  const getTotal = () => cartItems.reduce((sum, p) => sum + p.price*p.quantity, 0);

  const checkout = async () => {
    if (!user) throw new Error('User not logged in');
    if (cartItems.length === 0) throw new Error('Cart is empty');

    const orderData = {
      products: cartItems.map(p => ({ product: p._id, quantity: p.quantity })),
      total: getTotal()
    };

    const res = await OrderService.createOrder(orderData);
    if (res.success) clearCart();
    return res;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, getTotal, checkout }}>
      {children}
    </CartContext.Provider>
  );
};
