import { useEffect, useState } from 'react';
import { ProductService } from '../services';
import ProductCard from '../components/ProductCard';
import GlobalLayout from '../layouts/GlobalLayout.jsx';
import '../styles/pages/ProductCatalog.css';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState('');
  const [category, setCategory] = useState('');

  const fetchProducts = async () => {
    setLoading(true);
    let query = `?page=${page}&limit=${limit}`;
    if (sort) query += `&sort=${sort}`;
    if (category) query += `&category=${category}`;
    const res = await ProductService.getProducts(query);
    if (res.success) {
      setProducts(res.data);
      setTotalPages(res.pagination.pages);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProducts(); }, [page, sort, category]);

  return (
    <GlobalLayout>
      <div className="catalog-controls">
        <select value={category} onChange={e=>setCategory(e.target.value)}>
          <option value="">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothes">Clothes</option>
          <option value="service">Services</option>
        </select>
        <select value={sort} onChange={e=>setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price">Price ↑</option>
          <option value="-price">Price ↓</option>
        </select>
      </div>
      {loading ? <p>Loading...</p> : (
        <div className="catalog-grid">
          {products.map(p => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
      <div className="pagination">
        <button disabled={page<=1} onClick={()=>setPage(prev=>prev-1)}>Prev</button>
        <span>{page} / {totalPages}</span>
        <button disabled={page>=totalPages} onClick={()=>setPage(prev=>prev+1)}>Next</button>
      </div>
    </GlobalLayout>
  );
};

export default ProductCatalog;
