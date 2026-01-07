import { Link } from 'react-router-dom';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      {product.image && (
        <Link to={`/products/${product._id}`} className="product-image-link">
          <img src={product.image} alt={product.name} className="product-image" />
        </Link>
      )}

      <div className="product-info">
        <Link to={`/products/${product._id}`} className="product-name-link">
          <h3 className="product-name">{product.name}</h3>
        </Link>
        
        <p className="product-price">${product.price?.toFixed(2)}</p>
        <button 
          onClick={onAddToCart} 
          className="add-btn"
          disabled={product.countInStock <= 0}
        >
          {product.countInStock > 0 ? 'Add' : 'Epuizat'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;