import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import Modal from '../components/Modal';
import '../styles/pages/Cart.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, getTotal, checkout } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleCheckout = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await checkout(paymentMethod);
      if (res.success) {
        setIsSuccessModalOpen(true);
      } else {
        setMessage('Checkout failed: ' + res.message);
      }
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="cart-container">
      <Modal isOpen={isSuccessModalOpen} onClose={() => setIsSuccessModalOpen(false)}>
        <div className="success-modal">
          <h3>Comandă Plasata!</h3>
          <p>Comanda ta a fost înregistrată cu succes.</p>
          <div className="modal-actions">
            <button onClick={() => navigate('/profile')}>Comenzile mele</button>
            <button onClick={() => navigate('/')}>Continuă cumpărăturile</button>
          </div>
        </div>
      </Modal>

      <h2>Your Cart</h2>
      {message && <p className="cart-error">{message}</p>}
      
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
                  <td>
                    <Link to={`/products/${item._id}`} className="cart-link">
                      {item.name}
                    </Link>
                  </td>
                  <td>${item.price?.toFixed(2)}</td>
                  <td>
                    <div className="qty-controls">
                      <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-checkout-section">
            <div className="payment-selection">
              <h4>Metoda de plata:</h4>
              <label>
                <input 
                  type="radio" 
                  value="card" 
                  checked={paymentMethod === 'card'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                Plata cu cardul (Online)
              </label>
              <label>
                <input 
                  type="radio" 
                  value="ramburs" 
                  checked={paymentMethod === 'ramburs'} 
                  onChange={(e) => setPaymentMethod(e.target.value)} 
                />
                Plata ramburs (La livrare)
              </label>
            </div>

            <div className="cart-summary">
              <p>Total: ${getTotal().toFixed(2)}</p>
              <button onClick={handleCheckout} disabled={loading} className="checkout-btn">
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;