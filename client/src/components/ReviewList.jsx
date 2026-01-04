import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import '../styles/components/ReviewList.css';

const ReviewList = ({ reviews }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="review-list">
      {reviews.length === 0 && <p>No reviews yet.</p>}
      {reviews.map(r => (
        <div key={r._id} className="review-item">
          <p className="review-author">{r.user.name}:</p>
          <p className="review-text">{r.comment}</p>
          <p className="review-rating">Rating: {r.rating} / 5</p>
        </div>
      ))}
    </div>
  );
};

export default ReviewList;
