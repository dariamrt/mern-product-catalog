import { useContext, useState } from 'react';
import { CartContext } from '../contexts/CartContext';
import GlobalLayout from '../layouts/GlobalLayout.jsx';
import '../styles/pages/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, getTotal, checkout } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await checkout();
      if (res.success) setMessage('✅ Order placed successfully!');
      else setMessage('❌ Checkout failed: ' + res.message);
    } catch (err) {
      setMessage('❌ ' + err.message);
    }
    setLoading(false);
  };

  return (
    <GlobalLayout>
      <div className="cart-container">
        <h2>Your Cart</h2>
        {message && <p>{message}</p>}
        {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Qty</th>
                  <th>Total</th>
                  <th>Remove</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id}>
                    <td>{item.name}</td>
                    <td>${item.price?.toFixed(2)}</td>
                    <td>{item.quantity}</td>
                    <td>${(item.price*item.quantity).toFixed(2)}</td>
                    <td>
                      <button className="remove-btn" onClick={() => removeFromCart(item._id)}>×</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-summary">
              <p>Total: ${getTotal().toFixed(2)}</p>
              <button className="checkout-btn" onClick={handleCheckout} disabled={loading}>
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </GlobalLayout>
  );
};

export default Cart;
