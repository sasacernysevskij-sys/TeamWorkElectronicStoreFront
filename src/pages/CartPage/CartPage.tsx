import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './CartPage.css';

const BASE_URL = 'http://localhost:8000';

interface CartItem {
  cart_item_id: number;
  product_id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
  image_url?: string;
  stock?: number;
}

const CartPage = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  const fetchCart = () => {
    if (!token) {
      setError('Потрібно увійти в акаунт');
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/cart`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setItems(data.items || []);
        setTotalPrice(data.total_price || 0);
        setLoading(false);
      })
      .catch(() => {
        setError('Помилка завантаження кошика');
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    const res = await fetch(`${BASE_URL}/api/cart/items/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ quantity: newQuantity }),
    });

    if (res.ok) {
      fetchCart();
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      const err = await res.json();
      alert(err.detail || 'Помилка');
    }
  };

  const handleRemoveItem = async (productId: number) => {
    await fetch(`${BASE_URL}/api/cart/items/${productId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    fetchCart();
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleClear = async () => {
    if (!confirm('Очистити кошик?')) return;

    await fetch(`${BASE_URL}/api/cart`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    setItems([]);
    setTotalPrice(0);
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const handleCreateOrder = async () => {
    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
    });

    const data = await res.json();

    if (res.ok) {
      alert(`Замовлення №${data.order.id} створено!`);
      setItems([]);
      setTotalPrice(0);
      window.dispatchEvent(new Event('cartUpdated'));
    } else {
      alert(data.detail || 'Помилка створення замовлення');
    }
  };

  if (!token) {
    return (
      <div className="cart-login-required">
        <h2>Потрібно увійти в акаунт</h2>
        <Link to="/">На головну</Link>
      </div>
    );
  }

  if (loading) return <div className="cart-loading">Завантаження...</div>;
  if (error) return <div className="cart-error">{error}</div>;

  return (
    <div className="cart-page" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 className="cart-page-title">КОШИК</h1>

      {items.length === 0 ? (
        <div className="cart-empty">
          Кошик порожній
          <br />
          <Link to="/">Перейти до покупок</Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {items.map((item) => (
              <div key={item.cart_item_id} className="cart-item">
                <div className="cart-item-image">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} />
                  ) : (
                    <span className="cart-item-image-placeholder">📦</span>
                  )}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-meta">{item.price} ₴</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        width: '28px', height: '28px', border: '1px solid #ddd',
                        background: '#fff', cursor: 'pointer', fontSize: '16px',
                        borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      −
                    </button>
                    <span style={{ minWidth: '24px', textAlign: 'center' }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                      style={{
                        width: '28px', height: '28px', border: '1px solid #ddd',
                        background: '#fff', cursor: 'pointer', fontSize: '16px',
                        borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                      }}
                    >
                      +
                    </button>
                    <span style={{ marginLeft: '12px', color: '#888', fontSize: '13px' }}>
                      Макс: {item.stock ?? '?'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveItem(item.product_id)}
                  style={{
                    background: 'none',
                    border: '1px solid #e53935',
                    color: '#e53935',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    fontSize: '18px',
                    borderRadius: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                  title="Видалити з кошика"
                >
                  ×
                </button>
                <div className="cart-item-subtotal">{item.subtotal} ₴</div>
              </div>
            ))}
          </div>

          <div className="cart-footer">
            <button className="cart-clear-btn" onClick={handleClear}>
              Очистити кошик
            </button>
            <div className="cart-total">Разом: {totalPrice} ₴</div>
            <button className="cart-order-btn" onClick={handleCreateOrder}>
              ОФОРМИТИ ЗАМОВЛЕННЯ
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;