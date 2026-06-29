import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './OrdersPage.css';

const BASE_URL = 'http://localhost:8000';

interface OrderItem {
  product_id: number;
  name: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новый',
  processing: 'В обработке',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('Потрібно увійти в акаунт');
      setLoading(false);
      return;
    }

    fetch(`${BASE_URL}/api/orders`, {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => {
        setError('Помилка завантаження заказов');
        setLoading(false);
      });
  }, []);

  if (!token) {
    return (
      <div className="orders-login-required">
        <h2>Потрібно увійти в акаунт</h2>
        <Link to="/">На головну</Link>
      </div>
    );
  }

  if (loading) return <div className="orders-loading">Завантаження...</div>;
  if (error) return <div className="orders-error">{error}</div>;

  return (
    <div className="orders-page" style={{ maxWidth: '900px', margin: '40px auto', padding: '0 20px' }}>
      <h1 className="orders-title">МОЇ ЗАМОВЛЕННЯ</h1>

      {orders.length === 0 ? (
        <div className="orders-empty">
          У вас немає замовлень
          <br />
          <Link to="/">Перейти до покупок</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-header" onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}>
                <div>
                  <span className="order-id">Замовлення №{order.id}</span>
                  <span className="order-date">{new Date(order.created_at).toLocaleDateString('uk-UA')}</span>
                </div>
                <div className="order-header-right">
                  <span className={`order-status status-${order.status}`}>
                    {STATUS_LABELS[order.status] || order.status}
                  </span>
                  <span className="order-total">{order.total_price} ₴</span>
                  <span className="order-expand">{expandedOrder === order.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {expandedOrder === order.id && (
                <div className="order-details">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="order-item">
                      <span className="order-item-name">{item.name || `Товар #${item.product_id}`}</span>
                      <span className="order-item-qty">{item.quantity} шт.</span>
                      <span className="order-item-price">{item.price} ₴</span>
                      <span className="order-item-subtotal">{item.subtotal} ₴</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;