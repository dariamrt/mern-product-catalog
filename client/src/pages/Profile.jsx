import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { OrderService } from '../services';
import '../styles/pages/Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const res = await OrderService.OrderService.getMyOrders();
      if (res.success) setOrders(res.data);
    };
    fetchOrders();
  }, []);

  return (
    <div className="profile-container">
      <h2>{user?.name}'s Profile</h2>
      <p>Email: {user?.email}</p>
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
                <td><a href={`/orders/${o._id}`}>{o._id}</a></td>
                <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                <td>${o.totalPrice?.toFixed(2)}</td>
                <td>{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Profile;