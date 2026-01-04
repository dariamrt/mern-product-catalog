import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { OrderService } from '../services';
import GlobalLayout from '../layouts/GlobalLayout.jsx';
import '../styles/pages/Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await OrderService.getUserOrders();
      if (res.success) setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <GlobalLayout>
      <div className="profile-container">
        <h2>{user.name}'s Profile</h2>
        <p>Email: {user.email}</p>
        <h3>Your Orders</h3>
        {orders.length === 0 ? (
          <p>No orders yet.</p>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(o => (
                <tr key={o._id}>
                  <td>{o._id}</td>
                  <td>
                    <a href={`/orders/${o._id}`} className="order-link">
                        {new Date(o.createdAt).toLocaleDateString()}
                    </a>
                  </td>
                  <td>${o.total?.toFixed(2)}</td>
                  <td>{o.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </GlobalLayout>
  );
};

export default Profile;
