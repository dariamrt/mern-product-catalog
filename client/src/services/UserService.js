const API_URL = '/api/users';
const AUTH_URL = '/api/auth';

export const login = async (email, password) => {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
};

export const register = async (name, email, password) => {
  const res = await fetch(`${AUTH_URL}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
};

export const getMe = async (token) => {
  const res = await fetch(`${API_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const updateMe = async (token, updates) => {
  const res = await fetch(`${API_URL}/me`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json', 
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(updates)
  });
  return res.json();
};

export const getUsers = async (token, query = '') => {
  const res = await fetch(`${API_URL}${query}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const getUserById = async (token, userId) => {
  const res = await fetch(`${API_URL}/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};

export const updateUser = async (token, userId, updates) => {
  const res = await fetch(`${API_URL}/${userId}`, {
    method: 'PUT',
    headers: { 
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}` 
    },
    body: JSON.stringify(updates)
  });
  return res.json();
};

export const deleteUser = async (token, userId) => {
  const res = await fetch(`${API_URL}/${userId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.json();
};