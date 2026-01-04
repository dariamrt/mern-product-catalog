import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { ProductService, ReviewService } from '../services';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import ReviewList from '../components/ReviewList';
import GlobalLayout from '../layouts/GlobalLayout.jsx';
import '../styles/pages/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);

  const fetchProduct = async () => {
    setLoading(true);
    const res = await ProductService.getProductById(id);
    if (res.success) setProduct(res.data);
    const revRes = await ReviewService.getReviewsByProduct(id);
    if (revRes.success) setReviews(revRes.data);
    setLoading(false);
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const handleAddReview = async e => {
    e.preventDefault();
    if (!user) return;
    const res = await ReviewService.createReview(id, { comment, rating });
    if (res.success) {
      setComment('');
      setRating(5);
      fetchProduct();
    }
  };

  if (loading) return <GlobalLayout><p>Loading...</p></GlobalLayout>;
  if (!product) return <GlobalLayout><p>Product not found</p></GlobalLayout>;

  return (
    <GlobalLayout>
      <div className="product-details">
        <div className="details-left">
          <img src={product.image || '/placeholder.png'} alt={product.name} />
        </div>
        <div className="details-right">
          <h2>{product.name}</h2>
          <p className="price">${product.price?.toFixed(2) || '0.00'}</p>
          {product.category === 'electronics' && product.specs && (
            <ul>
              {Object.entries(product.specs).map(([k,v]) => <li key={k}>{k}: {v}</li>)}
            </ul>
          )}
          {product.category === 'clothes' && product.sizes && (
            <p>Sizes: {product.sizes.join(', ')}</p>
          )}
          {product.category === 'service' && product.details && (
            <p>{product.details}</p>
          )}
          <button className="add-to-cart" onClick={() => addToCart(product)}>Add to Cart</button>
        </div>
      </div>

      <div className="reviews-section">
        <h3>Reviews</h3>
        <ReviewList reviews={reviews} />
        {user && (
          <form className="add-review-form" onSubmit={handleAddReview}>
            <textarea placeholder="Your review" value={comment} onChange={e => setComment(e.target.value)} required />
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
            <button type="submit">Submit Review</button>
          </form>
        )}
      </div>
    </GlobalLayout>
  );
};

export default ProductDetails;
