const API_URL = '/api/orders';

export const OrderService = {
  createOrder: async (orderData) => {
    const token = localStorage.getItem('vbc_token');
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify(orderData)
    });
    return res.json();
  },

  getMyOrders: async (query = '') => {
    const token = localStorage.getItem('vbc_token');
    const res = await fetch(`${API_URL}/my${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getOrderById: async (orderId) => {
    const token = localStorage.getItem('vbc_token');
    const res = await fetch(`${API_URL}/${orderId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  getOrders: async (query = '') => {
    const token = localStorage.getItem('vbc_token');
    const res = await fetch(`${API_URL}${query}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
  },

  updateOrderStatus: async (orderId, status) => {
    const token = localStorage.getItem('vbc_token');
    const res = await fetch(`${API_URL}/${orderId}/status`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({ status })
    });
    return res.json();
  }
};