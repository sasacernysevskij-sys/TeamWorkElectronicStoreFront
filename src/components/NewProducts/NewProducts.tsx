import { useEffect, useState } from 'react';
import ProductCard from '../ProductCard/ProductCard';
import './NewProducts.css';

const BASE_URL = 'http://localhost:8000';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  sizes?: string[];
  product_type?: string;
}

const LIMIT = 8;

const NewProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState('');

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    fetch(`${BASE_URL}/api/products?is_new=true&limit=8`)
      .then((res) => {
        if (!res.ok) throw new Error('Не вдалося завантажити товари');
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.products || [];
        setProducts(items);
        setTotal(data.total || items.length);
      })
      .catch(() => {
        setError('Бекенд ще не підключено. Картки з\'являться після підключення API.');
      });
  }, [page]);

  return (
    <section className="new-products-section">
      <div className="section-header">
        <h2 className="section-title">НОВИНКИ</h2>
        <div className="section-nav">
          <button
            className="section-nav-btn"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            &#8592;
          </button>
          <button
            className="section-nav-btn"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            &#8594;
          </button>
        </div>
      </div>

      {error ? (
        <div className="error-placeholder">{error}</div>
      ) : products.length === 0 ? (
        <div className="loading-placeholder">Товари не знайдено</div>
      ) : (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
};

export default NewProducts;