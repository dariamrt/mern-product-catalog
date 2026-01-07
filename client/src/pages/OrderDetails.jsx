import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { OrderService } from '../services';
import '../styles/pages/OrderDetails.css';

const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      const res = await OrderService.OrderService.getOrderById(id);
      if (res.success) setOrder(res.data);
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading) return <p>Loading order details...</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div className="order-details">
      <h2>Order #{order?._id}</h2>
      <p><strong>Status:</strong> {order?.status}</p>
      <p><strong>Date:</strong> {order?.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</p>
      <p><strong>Total:</strong> ${order?.totalPrice?.toFixed(2)}</p>

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
          {order?.items?.map((p, index) => (
            <tr key={p.product?._id || index}>
              <td>{p.product?.name || 'Product Details Hidden'}</td>
              <td>{p.quantity}</td>
              <td>${p.price?.toFixed(2)}</td>
              <td>${(p.price * p.quantity).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrderDetails;