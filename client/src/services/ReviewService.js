const API_URL = '/api/reviews';

export const getReviewsByProduct = async (productId, query = '') => {
  const res = await fetch(`${API_URL}/product/${productId}${query}`);
  return res.json();
};

export const createReview = async (token, reviewData) => {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(reviewData)
  });
  return res.json();
};

export const deleteReview = async (token, reviewId) => {
  const res = await fetch(`${API_URL}/${reviewId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return res.json();
};