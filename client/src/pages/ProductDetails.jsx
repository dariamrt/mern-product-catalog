import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ProductService, ReviewService } from '../services';
import { CartContext } from '../contexts/CartContext';
import { AuthContext } from '../contexts/AuthContext';
import ReviewList from '../components/ReviewList';
import Modal from '../components/Modal';
import '../styles/pages/ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const [isEditMode, setIsEditMode] = useState(false);
  const [editData, setEditData] = useState({});

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const res = await ProductService.getProductById(id);
      if (res.success) {
        setProduct(res.data);
        setEditData(res.data);
      }
      const revRes = await ReviewService.getReviewsByProduct(id);
      if (revRes.success) setReviews(revRes.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProduct(); }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    if (user.isAdmin) return;
    addToCart(product);
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (user?.isAdmin) return;
    try {
      const res = await ReviewService.createReview(token, id, { rating, comment });
      if (res.success) {
        setComment('');
        fetchProduct();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await ProductService.updateProduct(token, id, editData);
      if (res.success) {
        setIsEditMode(false);
        fetchProduct();
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="product-details-container"><p>Loading...</p></div>;
  if (!product) return <div className="product-details-container"><p>Produsul nu a fost gasit.</p></div>;

  return (
    <div className="product-details-container">
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="auth-prompt">
          <h3>Autentificare necesara</h3>
          <p>Trebuie sa fii logat pentru a adauga in cos.</p>
          <div className="modal-actions">
            <button onClick={() => navigate('/login')}>Login</button>
            <button onClick={() => setIsAuthModalOpen(false)}>Inchide</button>
          </div>
        </div>
      </Modal>

      <div className="product-main">
        <div className="details-left">
          {product.image && <img src={product.image} alt={product.name} />}
        </div>

        <div className="details-right">
          {user?.isAdmin && (
            <button onClick={() => setIsEditMode(!isEditMode)} className="btn-toggle-edit">
              {isEditMode ? 'Anuleaza Editarea' : 'Editeaza Produs'}
            </button>
          )}

          {isEditMode ? (
            <form onSubmit={handleUpdateProduct} className="edit-product-form">
              <label>Nume Produs</label>
              <input 
                type="text" 
                value={editData.name} 
                onChange={e => setEditData({...editData, name: e.target.value})} 
              />
              <label>Pret</label>
              <input 
                type="number" 
                value={editData.price} 
                onChange={e => setEditData({...editData, price: Number(e.target.value)})} 
              />
              <label>Stoc</label>
              <input 
                type="number" 
                value={editData.countInStock} 
                onChange={e => setEditData({...editData, countInStock: Number(e.target.value)})} 
              />
              <label>URL Imagine</label>
              <input 
                type="text" 
                value={editData.image} 
                onChange={e => setEditData({...editData, image: e.target.value})} 
              />
              <label>Descriere</label>
              <textarea 
                value={editData.description} 
                onChange={e => setEditData({...editData, description: e.target.value})} 
              />
              <button type="submit">Salveaza Modificari</button>
            </form>
          ) : (
            <>
              <h2>{product.name}</h2>
              <p className="price">${product.price?.toFixed(2)}</p>
              <p className="stock">Stoc: {product.countInStock}</p>
              <p className="description">{product.description}</p>
              
              {!user?.isAdmin && (
                <button 
                  className="add-to-cart" 
                  onClick={handleAddToCart} 
                  disabled={product.countInStock <= 0}
                >
                  {product.countInStock > 0 ? 'Adauga in cos' : 'Stoc epuizat'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      <div className="reviews-section">
        <h3>Recenzii</h3>
        <ReviewList reviews={reviews} />
        
        {user && !user.isAdmin && (
          <form className="add-review-form" onSubmit={handleAddReview}>
            <textarea 
              placeholder="Lasa un review..." 
              value={comment} 
              onChange={e => setComment(e.target.value)} 
              required 
            />
            <select value={rating} onChange={e => setRating(Number(e.target.value))}>
              {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} Stele</option>)}
            </select>
            <button type="submit">Trimite Review</button>
          </form>
        )}
        
        {user?.isAdmin && (
          <p className="admin-note" style={{marginTop: '20px', color: '#666'}}>
            Adminii pot vizualiza recenziile, dar nu pot lasa feedback.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;