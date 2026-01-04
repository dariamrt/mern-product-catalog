import { useEffect, useState } from 'react';
import { ProductService, OrderService } from '../services';
import GlobalLayout from '../layouts/GlobalLayout.jsx';
import '../styles/pages/Dashboard.css';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ topProducts: [], avgPrice: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [sortKey, setSortKey] = useState('');

  const fetchData = async () => {
    setLoading(true);
    const res1 = await ProductService.getTopRatedAndAvgPrice();
    if (res1.success) setStats(res1.data);

    let query = '';
    if (filterStatus) query += `?status=${filterStatus}`;
    if (sortKey) query += filterStatus ? `&sort=${sortKey}` : `?sort=${sortKey}`;

    const res2 = await OrderService.getOrders(query);
    if (res2.success) setOrders(res2.data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [filterStatus, sortKey]);

  return (
    <GlobalLayout>
      <h2>Admin Dashboard</h2>

      <div className="dashboard-section">
        <h3>Average Product Price: ${stats.avgPrice.toFixed(2)}</h3>
        <h3>Top Rated Products:</h3>
        <ul>
          {stats.topProducts.map(p => (
            <li key={p._id}>{p.name} - Rating: {p.avgRating?.toFixed(1)}</li>
          ))}
        </ul>
      </div>

      <div className="dashboard-section">
        <h3>Orders</h3>
        <div className="filters">
          <label>
            Filter by Status: 
            <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">All</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </select>
          </label>
          <label>
            Sort by: 
            <select value={sortKey} onChange={e => setSortKey(e.target.value)}>
              <option value="">Default</option>
              <option value="total">Total</option>
              <option value="createdAt">Date</option>
            </select>
          </label>
        </div>

        {loading ? <p>Loading orders...</p> : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>
                    <Link to={`/orders/${o._id}`} className="order-link">{o._id}</Link>
                  </td>
                  <td>{o.user?.name}</td>
                  <td>${o.total?.toFixed(2)}</td>
                  <td>{o.status}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </GlobalLayout>
  );
};

export default Dashboard;
