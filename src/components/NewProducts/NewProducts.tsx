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

const NewProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${BASE_URL}/api/products?isNew=true&limit=8`)
      .then((res) => {
        if (!res.ok) throw new Error('Не вдалося завантажити товари');
        return res.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : data.products || []);
      })
      .catch(() => {
        setError('Бекенд ще не підключено. Картки з\'являться після підключення API.');
      });
  }, []);

  return (
    <section className="new-products-section">
      <div className="section-header">
        <h2 className="section-title">НОВИНКИ</h2>
        <div className="section-nav">
          <button className="section-nav-btn">&#8592;</button>
          <button className="section-nav-btn">&#8594;</button>
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