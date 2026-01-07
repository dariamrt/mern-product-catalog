import { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductService } from '../services'; 
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import ProductCard from '../components/ProductCard'; 
import Modal from '../components/Modal';
import '../styles/pages/ProductCatalog.css'; 

const ProductCatalog = () => {
  const [products, setProducts] = useState([]); 
  const [categories, setCategories] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [page, setPage] = useState(1); 
  const [totalPages, setTotalPages] = useState(1); 
  const [sort, setSort] = useState(''); 
  const [category, setCategory] = useState(''); 
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await ProductService.getCategories();
        if (res && res.success) setCategories(res.data || []);
      } catch (error) {
        console.error(error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setLoading(true); 
    let query = `?page=${page}&limit=12`; 
    if (sort) query += `&sort=${sort}`;
    if (category) query += `&category=${category}`;
    try {
      const res = await ProductService.getProducts(query);
      if (res && res.success) {
        setProducts(res.data || []);
        setTotalPages(res.pagination?.pages || 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, [page, sort, category]); 

  const handleAddToCart = (product) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      addToCart(product);
    }
  };

  return (
    <div className="catalog-container"> 
      <Modal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)}>
        <div className="auth-modal-content">
          <h3>Autentificare necesara</h3>
          <p>Trebuie sa fii logat pentru a adauga produse in cos.</p>
          <div className="modal-actions">
            <button onClick={() => navigate('/login')}>Intra in cont</button>
            <button onClick={() => setIsAuthModalOpen(false)}>Inchide</button>
          </div>
        </div>
      </Modal>

      <div className="catalog-controls">
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}>
          <option value="">Toate Categoriile</option>
          {categories.map((cat) => (
            <option key={cat || 'no-cat'} value={cat || ''}>
              {cat ? cat.charAt(0).toUpperCase() + cat.slice(1) : 'No Category Defined'}
            </option>
          ))}
        </select>
        <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}>
          <option value="">Sorteaza dupa</option>
          <option value="price">Pret ↑</option>
          <option value="-price">Pret ↓</option>
        </select>
      </div>

      {loading ? (
        <p>Se incarca produsele...</p>
      ) : (
        <>
          <div className="catalog-grid">
            {products.map(p => (
              <ProductCard 
                key={p._id} 
                product={p} 
                onAddToCart={() => handleAddToCart(p)} 
              />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page <= 1} onClick={() => setPage(prev => prev - 1)}>Prev</button>
              <span>{page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage(prev => prev + 1)}>Next</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductCatalog;