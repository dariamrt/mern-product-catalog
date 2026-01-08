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
      <Link to="/" className="navbar-logo">
        <img src="/logo-vibe.png" alt="Vibe & Byte" className="navbar-logo-img" />
        <span className="navbar-logo-tagline">Smart picks. One checkout.</span>
      </Link>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/">Produse</Link></li>
        
        {user ? (
          <>
            {!user.isAdmin && (
              <>
                <li>
                  <Link to="/profile" className="navbar-user">
                    <User size={18} />
                    <span>{user.name}</span>
                  </Link>
                </li>
                <li className="navbar-cart" onClick={() => navigate('/cart')}>
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </li>
              </>
            )}
            {user.isAdmin && (
              <li>
                <Link to="/dashboard" className="navbar-user">
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </Link>
              </li>
            )}
            <li className="navbar-logout" onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" className="navbar-login">Login</Link></li>
            <li><Link to="/register">Înregistrare</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;