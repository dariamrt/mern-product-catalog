import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';
import '../styles/components/ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  const handleAdd = () => addToCart(product);

  return (
    <div className="product-card">
      <Link to={`/products/${product._id}`} className="product-image-link">
        <img
          src={product.image || '/placeholder.png'}
          alt={product.name}
          className="product-image"
        />
      </Link>
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        {product.category === 'clothes' && product.sizes && (
          <p className="product-detail">Sizes: {product.sizes.join(', ')}</p>
        )}
        {product.category === 'electronics' && product.specs && (
          <p className="product-detail">
            {Object.entries(product.specs).map(([k,v]) => `${k}: ${v}`).join(', ')}
          </p>
        )}
        {product.category === 'service' && product.details && (
          <p className="product-detail">{product.details}</p>
        )}
        <div className="product-bottom">
          <span className="product-price">${product.price?.toFixed(2) || '0.00'}</span>
          <button onClick={handleAdd} className="add-btn">Add</button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
