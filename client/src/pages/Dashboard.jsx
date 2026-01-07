import { useEffect, useState, useContext } from 'react';
import { ProductService, OrderService, UserService } from '../services';
import { AuthContext } from '../contexts/AuthContext';
import Modal from '../components/Modal';
import '../styles/pages/Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { token } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('stats');
  const [stats, setStats] = useState({ topRated: [], priceStats: { avgPrice: 0 } });
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingChange, setPendingChange] = useState(null);
  const [editingOrderId, setEditingOrderId] = useState(null);

  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    price: 0, 
    category: '', 
    countInStock: 0, 
    image: '', 
    description: '' 
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'stats') {
        const sRes = await ProductService.getProductStats();
        if (sRes.success) setStats(sRes.data);
      } else if (activeTab === 'orders') {
        const oRes = await OrderService.OrderService.getOrders();
        if (oRes.success) setOrders(Array.isArray(oRes.data) ? oRes.data : []);
      } else if (activeTab === 'users') {
        const uRes = await UserService.getUsers(token);
        if (uRes.success) setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      } else if (activeTab === 'products') {
        const pRes = await ProductService.getProducts(searchTerm ? `?keyword=${searchTerm}` : '');
        if (pRes.success) setProducts(Array.isArray(pRes.data) ? pRes.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, searchTerm]);

  const openConfirmModal = (orderId, newStatus) => {
    setPendingChange({ orderId, newStatus });
    setIsModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingChange) return;
    try {
      const res = await OrderService.OrderService.updateOrderStatus(pendingChange.orderId, pendingChange.newStatus);
      if (res.success) {
        setOrders(prev => prev.map(o => o._id === pendingChange.orderId ? { ...o, status: pendingChange.newStatus } : o));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsModalOpen(false);
      setPendingChange(null);
      setEditingOrderId(null);
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await ProductService.createProduct(token, newProduct);
      if (res.success) {
        setIsProductModalOpen(false);
        setNewProduct({ name: '', price: 0, category: '', countInStock: 0, image: '', description: '' });
        if (activeTab === 'products') fetchData();
      } else {
        alert(res.message);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Stergi acest utilizator?')) {
      try {
        const res = await UserService.deleteUser(token, userId);
        if (res.success) fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-tabs">
        <button className={activeTab === 'stats' ? 'active' : ''} onClick={() => setActiveTab('stats')}>Statistici</button>
        <button className={activeTab === 'orders' ? 'active' : ''} onClick={() => setActiveTab('orders')}>Comenzi</button>
        <button className={activeTab === 'products' ? 'active' : ''} onClick={() => setActiveTab('products')}>Produse</button>
        <button className={activeTab === 'users' ? 'active' : ''} onClick={() => setActiveTab('users')}>Utilizatori</button>
      </div>

      <div className="dashboard-content">
        {loading ? <p>Incarcare...</p> : (
          <>
            {activeTab === 'stats' && (
              <div className="dashboard-section">
                <h3>Performanta Produse</h3>
                <p>Pret Mediu: ${stats.priceStats?.avgPrice?.toFixed(2)}</p>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
                  {stats.topRated?.map(p => (
                    <div key={p._id} className="stat-card" style={{ border: '1px solid var(--border-color)', padding: '1rem', borderRadius: '8px' }}>
                      <Link to={`/products/${p._id}`} className="order-link"><strong>{p.name}</strong></Link>
                      <p>Rating: {p.rating} ⭐</p>
                      <p>Recenzii: {p.numReviews || 0}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="dashboard-section">
                <h3>Management Comenzi</h3>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Client</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Data</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? orders.map(o => (
                      <tr key={o._id}>
                        <td><Link to={`/orders/${o._id}`} className="order-link">{o._id.slice(-6)}</Link></td>
                        <td>{o.user?.name || 'N/A'}</td>
                        <td>${o.totalPrice?.toFixed(2)}</td>
                        <td>
                          <div className="status-wrapper">
                            {editingOrderId === o._id ? (
                              <select 
                                value={o.status} 
                                onChange={(e) => openConfirmModal(o._id, e.target.value)}
                                onBlur={() => !isModalOpen && setEditingOrderId(null)}
                                autoFocus
                              >
                                <option value="pending">pending</option>
                                <option value="paid">paid</option>
                                <option value="shipped">shipped</option>
                                <option value="completed">completed</option>
                                <option value="cancelled">cancelled</option>
                              </select>
                            ) : (
                              <>
                                <span className={`status-text status-${o.status}`}>{o.status}</span>
                                <span className="edit-icon" onClick={() => setEditingOrderId(o._id)}>✎</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                      </tr>
                    )) : (
                      <tr><td colSpan="5">Nu exista comenzi.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="dashboard-section">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <h3>Produse</h3>
                  <button className="btn-confirm" onClick={() => setIsProductModalOpen(true)}>+ Produs Nou</button>
                </div>
                <input 
                  type="text" 
                  placeholder="Cauta produs..." 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                />
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Nume</th>
                      <th>Pret</th>
                      <th>Stoc</th>
                      <th>Categorie</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td><Link to={`/products/${p._id}`} className="order-link">{p.name}</Link></td>
                        <td>${p.price?.toFixed(2)}</td>
                        <td>{p.countInStock}</td>
                        <td>{p.category}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="dashboard-section">
                <h3>Utilizatori System</h3>
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Nume</th>
                      <th>Email</th>
                      <th>Rol</th>
                      <th>Actiuni</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.email}</td>
                        <td>{u.isAdmin ? 'Admin' : 'User'}</td>
                        <td>
                          {!u.isAdmin && (
                            <button 
                              className="btn-cancel" 
                              style={{ padding: '4px 8px', fontSize: '0.8rem' }}
                              onClick={() => handleDeleteUser(u._id)}
                            >
                              Sterge
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingOrderId(null); }}>
        <h3>Confirmare Schimbare Status</h3>
        <p>Sigur vrei sa schimbi statusul in <strong>{pendingChange?.newStatus}</strong>?</p>
        <div className="modal-actions">
          <button onClick={confirmStatusChange} className="btn-confirm">Confirma</button>
          <button onClick={() => { setIsModalOpen(false); setEditingOrderId(null); }} className="btn-cancel">Anuleaza</button>
        </div>
      </Modal>

      <Modal isOpen={isProductModalOpen} onClose={() => setIsProductModalOpen(false)}>
        <div className="add-product-container">
          <div className="modal-header">
            <h3>Adaugare Produs Nou</h3>
            <p>Introdu detaliile necesare pentru listarea noului produs</p>
          </div>
          
          <form onSubmit={handleCreateProduct} className="pretty-form">
            <div className="form-group">
              <label>Denumire Produs</label>
              <input 
                type="text" 
                placeholder="Ex: Laptop UltraBook Pro..." 
                value={newProduct.name} 
                onChange={e => setNewProduct({...newProduct, name: e.target.value})} 
                required 
              />
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Pret Vanzare (RON)</label>
                <input 
                  type="number" 
                  step="0.01" 
                  placeholder="0.00" 
                  value={newProduct.price} 
                  onChange={e => setNewProduct({...newProduct, price: e.target.value})} 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Cantitate in Stoc</label>
                <input 
                  type="number" 
                  placeholder="0" 
                  value={newProduct.countInStock} 
                  onChange={e => setNewProduct({...newProduct, countInStock: e.target.value})} 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Categorie Produs</label>
              <input 
                type="text" 
                placeholder="Ex: Electronice / Accesorii" 
                value={newProduct.category} 
                onChange={e => setNewProduct({...newProduct, category: e.target.value})} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Link Imagine (URL)</label>
              <input 
                type="text" 
                placeholder="https://exemplu.com/imagine.jpg" 
                value={newProduct.image} 
                onChange={e => setNewProduct({...newProduct, image: e.target.value})} 
              />
            </div>

            <div className="form-group">
              <label>Descriere Detaliata</label>
              <textarea 
                rows="4" 
                placeholder="Specificatii, avantaje, detalii tehnice..." 
                value={newProduct.description} 
                onChange={e => setNewProduct({...newProduct, description: e.target.value})} 
              />
            </div>

            <div className="modal-footer-actions">
              <button type="submit" className="btn-confirm-save">Creeaza Produs</button>
              <button type="button" className="btn-cancel-modal" onClick={() => setIsProductModalOpen(false)}>Renunta</button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default Dashboard;