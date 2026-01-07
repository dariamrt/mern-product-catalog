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
      const currentQty = existing ? existing.quantity : 0;
      if (currentQty >= product.countInStock) {
        alert("Stoc insuficient pentru acest produs.");
        return prev;
      }
      if (existing) return prev.map(p => p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = item.quantity + amount;
        if (newQty > item.countInStock) {
          alert("Stoc maxim atins.");
          return item;
        }
        return { ...item, quantity: newQty > 0 ? newQty : 1 };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(p => p._id !== id));
  };

  const clearCart = () => setCartItems([]);
  const getTotal = () => cartItems.reduce((sum, p) => sum + p.price * p.quantity, 0);

  const checkout = async (method) => {
    if (!user) throw new Error('User not logged in');
    if (cartItems.length === 0) throw new Error('Cart is empty');

    const orderData = {
      items: cartItems.map(p => ({
        product: p._id,
        quantity: p.quantity,
        price: p.price
      })),
      totalPrice: getTotal(),
      status: method === 'card' ? 'paid' : 'pending'
    };

    const res = await OrderService.OrderService.createOrder(orderData);
    if (res && res.success) clearCart();
    return res;
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getTotal, checkout }}>
      {children}
    </CartContext.Provider>
  );
};