import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './ComparePage.css';

const BASE_URL = 'http://localhost:8000';

interface CompareProduct {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  rating?: number;
  product_type?: string;
  description?: string;
  article?: string;
}

const ComparePage = () => {
  const [products, setProducts] = useState<CompareProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    const stored = localStorage.getItem('compare');
    const ids: number[] = stored ? JSON.parse(stored) : [];

    if (ids.length === 0) {
      setProducts([]);
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/products?limit=100`)
      .then(r => r.json())
      .then(data => {
        const allProducts = data.products || [];
        const matched = allProducts.filter((p: CompareProduct) => ids.includes(p.id));
        setProducts(matched);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadProducts();
    window.addEventListener('compareUpdated', loadProducts);
    return () => window.removeEventListener('compareUpdated', loadProducts);
  }, []);

  const handleRemove = (id: number) => {
    const stored = localStorage.getItem('compare');
    let list: number[] = stored ? JSON.parse(stored) : [];
    list = list.filter(i => i !== id);
    localStorage.setItem('compare', JSON.stringify(list));
    window.dispatchEvent(new Event('compareUpdated'));
  };

  const handleClear = () => {
    localStorage.setItem('compare', '[]');
    window.dispatchEvent(new Event('compareUpdated'));
  };

  if (loading) return <div className="compare-loading">Завантаження...</div>;

  return (
    <div className="compare-page">
      <h1 className="compare-title">ПОРІВНЯННЯ ТОВАРІВ</h1>

      {products.length === 0 ? (
        <div className="compare-empty">
          Немає товарів для порівняння
          <br />
          <Link to="/">Перейти до покупок</Link>
        </div>
      ) : (
        <>
          <button className="compare-clear-btn" onClick={handleClear}>
            Очистити список
          </button>

          <div className="compare-table-wrap">
            <table className="compare-table">
              <thead>
                <tr>
                  <th>Характеристика</th>
                  {products.map(p => (
                    <th key={p.id}>
                      <button className="compare-remove-btn" onClick={() => handleRemove(p.id)}>✕</button>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Зображення</td>
                  {products.map(p => (
                    <td key={p.id}>
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.name} className="compare-img" />
                      ) : '📦'}
                    </td>
                  ))}
                </tr>
                <tr className="compare-row-alt">
                  <td>Назва</td>
                  {products.map(p => <td key={p.id}>{p.name}</td>)}
                </tr>
                <tr>
                  <td>Ціна</td>
                  {products.map(p => <td key={p.id} className="compare-price">{p.price} ₴</td>)}
                </tr>
                <tr className="compare-row-alt">
                  <td>Рейтинг</td>
                  {products.map(p => <td key={p.id}>⭐ {p.rating?.toFixed(1) || '—'}</td>)}
                </tr>
                <tr>
                  <td>Тип</td>
                  {products.map(p => <td key={p.id}>{p.product_type || '—'}</td>)}
                </tr>
                <tr className="compare-row-alt">
                  <td>Артикул</td>
                  {products.map(p => <td key={p.id}>{p.article || '—'}</td>)}
                </tr>
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default ComparePage;