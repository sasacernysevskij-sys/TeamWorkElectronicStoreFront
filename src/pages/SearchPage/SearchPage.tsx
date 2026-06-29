import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import type { Product } from '../../components/ProductCard/ProductCard';
import './SearchPage.css';

const BASE_URL = 'http://localhost:8000';
const LIMIT = 9;

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(total / LIMIT);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const skip = (page - 1) * LIMIT;
    fetch(`${BASE_URL}/api/products?search=${encodeURIComponent(query)}&skip=${skip}&limit=${LIMIT}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [query, page]);

  return (
    <div className="search-page">
      <h1 className="search-page-title">
        {query ? `Результати пошуку: "${query}"` : 'Пошук'}
      </h1>

      {!query ? (
        <p className="search-page-empty">Введіть запит у полі пошуку</p>
      ) : loading ? (
        <p className="search-page-empty">Завантаження...</p>
      ) : products.length === 0 ? (
        <p className="search-page-empty">Нічого не знайдено</p>
      ) : (
        <>
          <p className="search-page-count">Знайдено: {total}</p>
          <div className="search-page-grid">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
          {totalPages > 1 && (
            <div className="search-page-pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`search-page-btn${p === page ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchPage;