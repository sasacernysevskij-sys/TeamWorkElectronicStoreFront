import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './FavoritePage.css';

const BASE_URL = 'http://localhost:8000';

interface FavoriteItem {
  favorite_id: number;
  product_id: number;
  name: string;
  price: number;
  image_url?: string;
  rating?: number;
  stock?: number;
  product_type?: string;
}

const FavoritesPage = () => {
  const [items, setItems] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchFavorites = () => {
    if (!token) {
      setError('Потрібно увійти в акаунт');
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/favorites`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Помилка завантаження обраних товарів');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (productId: number) => {
    await fetch(`${BASE_URL}/api/favorites/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });
    setItems((prev) => prev.filter((item) => item.product_id !== productId));
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  const handleAddToCart = async (productId: number, name: string) => {
    const res = await fetch(`${BASE_URL}/api/cart/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ product_id: productId, quantity: 1 }),
    });

    if (res.ok) {
      alert(`Товар "${name}" додано до кошика`);
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      const err = await res.json();
      alert(err.detail || 'Помилка');
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Видалити всі обрані товари?')) return;

    await fetch(`${BASE_URL}/api/favorites`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    setItems([]);
    window.dispatchEvent(new Event('favoritesUpdated'));
  };

  if (!token) {
    return (
      <div className="fav-login-required">
        <h2>Потрібно увійти в акаунт</h2>
        <Link to="/">На головну</Link>
      </div>
    );
  }

  if (loading) return <div className="fav-loading">Завантаження...</div>;
  if (error) return <div className="fav-error">{error}</div>;

  return (
    <div className="fav-page" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 className="fav-title">ОБРАНЕ</h1>

      {items.length === 0 ? (
        <div className="fav-empty">
          Немає обраних товарів
          <br />
          <Link to="/">Перейти до покупок</Link>
        </div>
      ) : (
        <>
          <div className="fav-items">
            {items.map((item) => (
              <div key={item.favorite_id} className="fav-item">
                <div className="fav-item-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} />
                  ) : (
                    <span className="fav-item-image-placeholder">📦</span>
                  )}
                </div>
                <div className="fav-item-info">
                  <div className="fav-item-name">{item.name}</div>
                  <div className="fav-item-price">{item.price} ₴</div>
                  {item.rating != null && (
                    <div style={{ color: '#f5c518', fontSize: '13px', marginTop: '4px' }}>
                      ⭐ {Number(item.rating).toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="fav-item-actions">
                  <button
                    className="fav-add-to-cart-btn"
                    onClick={() => handleAddToCart(item.product_id, item.name)}
                  >
                    В кошик
                  </button>
                  <button
                    className="fav-remove-btn"
                    onClick={() => handleRemove(item.product_id)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="fav-footer">
            <button className="fav-clear-all-btn" onClick={handleClearAll}>
              Видалити всі
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FavoritesPage;