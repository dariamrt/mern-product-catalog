const API_URL = '/api/products';

export const getProducts = async (query = '') => {
  const res = await fetch(`${API_URL}${query}`);
  return res.json();
};

export const getProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  return res.json();
};

// Admin
export const getProductStats = async () => {
  const res = await fetch(`${API_URL}/stats`);
  return res.json();
};

export const createProduct = async (token, productData) => {
  const res = await fetch(`${API_URL}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(productData)
  });
  return res.json();
};

export const updateProduct = async (token, productId, updates) => {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(updates)
  });
  return res.json();
};

export const deleteProduct = async (token, productId) => {
  const res = await fetch(`${API_URL}/${productId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};
