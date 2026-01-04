import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderService } from '../services';
import GlobalLayout from '../layouts/GlobalLayout.jsx';
import '../styles/pages/OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    setLoading(true);
    const res = await OrderService.getOrderById(id);
    if (res.success) setOrder(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchOrder(); }, [id]);

  if (loading) return <GlobalLayout><p>Loading...</p></GlobalLayout>;
  if (!order) return <GlobalLayout><p>Order not found</p></GlobalLayout>;

  return (
    <GlobalLayout>
      <div className="order-details">
        <h2>Order #{order._id}</h2>
        <p><strong>Status:</strong> {order.status}</p>
        <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
        <p><strong>Total:</strong> ${order.total?.toFixed(2)}</p>

        <h3>Products</h3>
        <table className="order-products-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map(p => (
              <tr key={p.product._id}>
                <td>{p.product.name}</td>
                <td>{p.quantity}</td>
                <td>${p.product.price?.toFixed(2)}</td>
                <td>${(p.product.price * p.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </GlobalLayout>
  );
};

export default OrderDetails;
