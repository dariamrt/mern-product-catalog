import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCart, LogOut, User, LayoutDashboard } from 'lucide-react';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Vibe & Byte</Link>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/">Produse</Link></li>
        
        {user ? (
          <>
            {!user.isAdmin && (
              <>
                <li>
                  <Link to="/profile" className="navbar-user">
                    <User size={18} /> <span>{user.name}</span>
                  </Link>
                </li>
                <li className="navbar-cart" onClick={() => navigate('/cart')} style={{cursor: 'pointer'}}>
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </li>
              </>
            )}
            {user.isAdmin && (
              <li>
                <Link to="/dashboard" className="navbar-user">
                  <LayoutDashboard size={18} /> <span>Dashboard</span>
                </Link>
              </li>
            )}
            <li onClick={handleLogout} style={{cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
              <LogOut size={18} /> Logout
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" style={{ fontWeight: 'bold' }}>Login</Link></li>
            <li><Link to="/register">Inregistrare</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;