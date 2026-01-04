import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { ShoppingCart, LogOut, User } from 'lucide-react';
import '../styles/components/Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">Vibe & Byte</Link>
      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/products">Products</Link></li>
        {user && user.role === 'admin' && <li><Link to="/dashboard">Dashboard</Link></li>}
        {user ? (
          <>
            <li className="navbar-user" onClick={() => setMenuOpen(!menuOpen)}>
              <User size={18} /> <span>{user.name}</span>
            </li>
            <li onClick={handleLogout}><LogOut size={18} /> Logout</li>
          </>
        ) : (
          <>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </>
        )}
        <li className="navbar-cart" onClick={() => navigate('/cart')}>
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
        </li>
      </ul>
      <div className={`navbar-toggle ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(!menuOpen)}>
        <span></span><span></span><span></span>
      </div>
    </nav>
  );
};

export default Navbar;
