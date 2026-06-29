import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const BASE_URL = 'http://localhost:8000';

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'add-product' | 'edit-product';

interface ProductItem {
  id: number;
  name: string;
  price: number;
  product_type: string;
  stock: number;
  rating: number;
  article: string;
  description: string;
  image_url: string;
}

interface OrderItem {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
}

interface UserItem {
  id: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
  role: string;
  created_at: string;
}

interface OrderDetail {
  order: OrderItem;
  items: {
    id: number;
    product_name: string;
    article: string;
    quantity: number;
    price: number;
    subtotal: number;
  }[];
}

const STATUS_LABELS: Record<string, string> = {
  new: 'Новий',
  processing: 'В обробці',
  shipped: 'Відправлено',
  delivered: 'Доставлено',
  cancelled: 'Скасовано',
};

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, revenue: 0, ordersThisMonth: 0 });
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [notification, setNotification] = useState('');
  const [notifType, setNotifType] = useState<'success' | 'error'>('success');
  const [selectedOrder, setSelectedOrder] = useState<OrderDetail | null>(null);
  const [editProduct, setEditProduct] = useState<ProductItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Форма добавления
  const [prodName, setProdName] = useState('');
  const [prodArticle, setProdArticle] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodType, setProdType] = useState('sporyadzhennya');
  const [prodStock, setProdStock] = useState('');
  const [prodRating, setProdRating] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');
  const showNotif = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification(msg);
    setNotifType(type);
    setTimeout(() => setNotification(''), 3000);
  };

  const token = localStorage.getItem('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  const fetchStats = () => {
    Promise.all([
      fetch(`${BASE_URL}/api/products?limit=1`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE_URL}/api/orders/admin/count`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE_URL}/api/users`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE_URL}/api/orders/admin/last-month/sum`, { headers: authHeaders }).then(r => r.json()),
      fetch(`${BASE_URL}/api/orders/admin/last-month`, { headers: authHeaders }).then(r => r.json()),
    ])
      .then(([prodData, ordersCount, usersData, revenueData, monthOrders]) => {
        setStats({
          totalProducts: prodData.total || 0,
          totalOrders: ordersCount.orders_count || 0,
          totalUsers: Array.isArray(usersData) ? usersData.length : 0,
          revenue: revenueData.total_sum || 0,
          ordersThisMonth: Array.isArray(monthOrders) ? monthOrders.length : 0,
        });
      })
      .catch(() => {});
  };
  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (tab === 'orders') {
      fetch(`${BASE_URL}/api/orders/admin?limit=100`, { headers: authHeaders })
        .then(r => r.json())
        .then(d => setOrders(Array.isArray(d) ? d : []))
        .catch(() => {});
    }
    if (tab === 'products') {
      fetch(`${BASE_URL}/api/products?limit=100`, { headers: authHeaders })
        .then(r => r.json())
        .then(d => setProducts(d.products || []))
        .catch(() => {});
    }
    if (tab === 'users') {
      fetch(`${BASE_URL}/api/users?limit=100`, { headers: authHeaders })
        .then(r => r.json())
        .then(d => setUsers(Array.isArray(d) ? d : []))
        .catch(() => {});
    }
  }, [tab]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodArticle) {
      showNotif("Заповніть обов'язкові поля", 'error');
      return;
    }
    try {
      const res = await fetch(`${BASE_URL}/api/products`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: prodName,
          article: prodArticle,
          price: Number(prodPrice),
          product_type: prodType,
          stock: Number(prodStock) || 0,
          rating: Number(prodRating) || 0,
          description: prodDesc,
          image_url: prodImage,
        }),
      });
      if (!res.ok) throw new Error('Помилка');
      showNotif('Товар успішно додано!');
      setProdName(''); setProdArticle(''); setProdPrice(''); setProdStock(''); setProdRating(''); setProdDesc(''); setProdImage('');
      fetchStats();
      setTab('products');
    } catch {
      showNotif('Помилка додавання товару', 'error');
    }
  };
  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editProduct) return;
    try {
      const res = await fetch(`${BASE_URL}/api/products/${editProduct.id}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          name: editProduct.name,
          article: editProduct.article,
          price: editProduct.price,
          product_type: editProduct.product_type,
          stock: editProduct.stock,
          rating: editProduct.rating,
          description: editProduct.description,
          image_url: editProduct.image_url,
        }),
      });
      if (!res.ok) throw new Error('Помилка');
      showNotif('Товар оновлено!');
      setEditProduct(null);
      setTab('products');
      fetchStats();
    } catch {
      showNotif('Помилка оновлення', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Видалити товар?')) return;
    try {
      await fetch(`${BASE_URL}/api/products/${id}`, { method: 'DELETE', headers: authHeaders });
      setProducts(prev => prev.filter(p => p.id !== id));
      fetchStats();
      showNotif('Товар видалено');
    } catch {
      showNotif('Помилка видалення', 'error');
    }
  };

  const handleViewOrder = async (orderId: number) => {
    const res = await fetch(`${BASE_URL}/api/orders/admin/${orderId}/items`, { headers: authHeaders });
    const data = await res.json();
    setSelectedOrder(data);
  };

  const handleUpdateOrderStatus = async (_orderId: number, newStatus: string) => {
    // Заглушка — нужно добавить эндпоинт PATCH /api/orders/admin/{id}/status
    showNotif(`Статус змінено на "${STATUS_LABELS[newStatus] || newStatus}"`);
    setSelectedOrder(null);
  };

  const handleMakeAdmin = async (email: string) => {
    await fetch(`${BASE_URL}/api/auth/make-admin?email=${encodeURIComponent(email)}`, { method: 'POST' });
    showNotif(`Користувач ${email} тепер адмін`);
    setTab('users');
  };

  const navItems: { id: Tab; label: string }[] = [
    { id: 'dashboard', label: '📊 Дашборд' },
    { id: 'products', label: '📦 Товари' },
    { id: 'add-product', label: '➕ Додати товар' },
    { id: 'orders', label: '🛒 Замовлення' },
    { id: 'users', label: '👥 Користувачі' },
  ];

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.article.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-logo">
          <div>
            <span>M·TAC</span>
            <p>Адмін панель</p>
          </div>
        </div>
        <nav className="admin-nav">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item${tab === item.id ? ' active' : ''}`}
              onClick={() => { setTab(item.id); setEditProduct(null); }}
            >
              {item.label}
            </button>
          ))}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="admin-nav-item">← На сайт</button>
          </Link>
        </nav>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>{navItems.find((n) => n.id === tab)?.label || 'Адмін'}</h1>
        </div>

        <div className="admin-content">
          {/* ===== DASHBOARD ===== */}
          {tab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-label">Всього товарів</div>
                  <div className="stat-card-value">{stats.totalProducts}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Всього замовлень</div>
                  <div className="stat-card-value">{stats.totalOrders}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Користувачів</div>
                  <div className="stat-card-value">{stats.totalUsers}</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Дохід (30 днів)</div>
                  <div className="stat-card-value">{stats.revenue.toLocaleString('uk-UA')} ₴</div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Замовлень за місяць</div>
                  <div className="stat-card-value">{stats.ordersThisMonth}</div>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-card-header"><h3>Швидкі дії</h3></div>
                <div className="admin-panel-card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setTab('add-product')}>➕ Додати товар</button>
                  <button className="btn-secondary" onClick={() => setTab('orders')}>🛒 Замовлення</button>
                  <button className="btn-secondary" onClick={() => setTab('users')}>👥 Користувачі</button>
                </div>
              </div>
            </>
          )}
          {/* ===== PRODUCTS ===== */}
          {tab === 'products' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header">
                <h3>Список товарів ({filteredProducts.length})</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    placeholder="Пошук..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    style={{ padding: '6px 10px', border: '1px solid #ddd', borderRadius: 4, fontSize: 13 }}
                  />
                  <button className="btn-primary" onClick={() => setTab('add-product')}>+ Додати</button>
                </div>
              </div>
              <div className="admin-panel-card-body">
                {filteredProducts.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Немає товарів</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Назва</th><th>Артикул</th><th>Тип</th><th>Ціна</th><th>Залишок</th><th>Рейтинг</th><th>Дії</th></tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((p) => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.article}</td>
                          <td>{p.product_type}</td>
                          <td>{p.price} ₴</td>
                          <td>{p.stock}</td>
                          <td>⭐ {p.rating}</td>
                          <td>
                            <button className="btn-edit" onClick={() => { setEditProduct(p); setTab('edit-product'); }}>Ред.</button>
                            <button className="btn-danger" onClick={() => handleDeleteProduct(p.id)}>Вид.</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
          {/* ===== ADD PRODUCT ===== */}
          {tab === 'add-product' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header"><h3>Додати товар</h3></div>
              <div className="admin-panel-card-body">
                <form onSubmit={handleAddProduct} className="admin-form">
                  <div className="admin-form-group"><label>Назва *</label><input value={prodName} onChange={e => setProdName(e.target.value)} /></div>
                  <div className="admin-form-group"><label>Артикул *</label><input value={prodArticle} onChange={e => setProdArticle(e.target.value)} /></div>
                  <div className="admin-form-group"><label>Ціна *</label><input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} /></div>
                  <div className="admin-form-group">
                    <label>Тип</label>
                    <select value={prodType} onChange={e => setProdType(e.target.value)}>
                      <option value="sporyadzhennya">Спорядження</option>
                      <option value="vzuttya">Взуття</option>
                      <option value="odyag">Одяг</option>
                      <option value="taktychne">Тактичне</option>
                    </select>
                  </div>
                  <div className="admin-form-group"><label>Залишок</label><input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} /></div>
                  <div className="admin-form-group"><label>Рейтинг</label><input type="number" step="0.1" value={prodRating} onChange={e => setProdRating(e.target.value)} /></div>
                  <div className="admin-form-group full"><label>Опис</label><textarea value={prodDesc} onChange={e => setProdDesc(e.target.value)} /></div>
                  <div className="admin-form-group full"><label>URL зображення</label><input value={prodImage} onChange={e => setProdImage(e.target.value)} /></div>
                  <div className="admin-form-actions">
                    <button type="submit" className="btn-primary">Додати</button>
                    <button type="button" className="btn-secondary" onClick={() => setTab('products')}>Скасувати</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* ===== EDIT PRODUCT ===== */}
          {tab === 'edit-product' && editProduct && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header"><h3>Редагувати товар #{editProduct.id}</h3></div>
              <div className="admin-panel-card-body">
                <form onSubmit={handleUpdateProduct} className="admin-form">
                  <div className="admin-form-group"><label>Назва</label><input value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} /></div>
                  <div className="admin-form-group"><label>Артикул</label><input value={editProduct.article} onChange={e => setEditProduct({...editProduct, article: e.target.value})} /></div>
                  <div className="admin-form-group"><label>Ціна</label><input type="number" value={editProduct.price} onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})} /></div>
                  <div className="admin-form-group">
                    <label>Тип</label>
                    <select value={editProduct.product_type} onChange={e => setEditProduct({...editProduct, product_type: e.target.value})}>
                      <option value="sporyadzhennya">Спорядження</option>
                      <option value="vzuttya">Взуття</option>
                      <option value="odyag">Одяг</option>
                      <option value="taktychne">Тактичне</option>
                    </select>
                  </div>
                  <div className="admin-form-group"><label>Залишок</label><input type="number" value={editProduct.stock} onChange={e => setEditProduct({...editProduct, stock: Number(e.target.value)})} /></div>
                  <div className="admin-form-group"><label>Рейтинг</label><input type="number" step="0.1" value={editProduct.rating} onChange={e => setEditProduct({...editProduct, rating: Number(e.target.value)})} /></div>
                  <div className="admin-form-group full"><label>Опис</label><textarea value={editProduct.description} onChange={e => setEditProduct({...editProduct, description: e.target.value})} /></div>
                  <div className="admin-form-group full"><label>URL зображення</label><input value={editProduct.image_url} onChange={e => setEditProduct({...editProduct, image_url: e.target.value})} /></div>
                  <div className="admin-form-actions">
                    <button type="submit" className="btn-primary">Зберегти</button>
                    <button type="button" className="btn-secondary" onClick={() => { setEditProduct(null); setTab('products'); }}>Скасувати</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          {/* ===== ORDERS ===== */}
          {tab === 'orders' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header"><h3>Замовлення ({orders.length})</h3></div>
              <div className="admin-panel-card-body">
                {orders.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Немає замовлень</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Користувач</th><th>Сума</th><th>Статус</th><th>Дата</th><th>Дії</th></tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>#{o.user_id}</td>
                          <td>{o.total_price} ₴</td>
                          <td><span className={`badge badge-${o.status === 'new' ? 'blue' : o.status === 'delivered' ? 'green' : 'yellow'}`}>{STATUS_LABELS[o.status] || o.status}</span></td>
                          <td>{new Date(o.created_at).toLocaleDateString('uk-UA')}</td>
                          <td><button className="btn-edit" onClick={() => handleViewOrder(o.id)}>Деталі</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedOrder && (
                  <div style={{ marginTop: 20, padding: 16, background: '#f9f9f9', borderRadius: 8 }}>
                    <h4>Замовлення №{selectedOrder.order.id}</h4>
                    <p>Статус: {STATUS_LABELS[selectedOrder.order.status]} | Сума: {selectedOrder.order.total_price} ₴</p>
                    <table className="admin-table" style={{ marginTop: 12 }}>
                      <thead><tr><th>Товар</th><th>Артикул</th><th>К-ть</th><th>Ціна</th><th>Сума</th></tr></thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={item.id}>
                            <td>{item.product_name}</td>
                            <td>{item.article}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} ₴</td>
                            <td>{item.subtotal} ₴</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                      {['processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                        <button key={s} className="btn-secondary" onClick={() => handleUpdateOrderStatus(selectedOrder.order.id, s)}>
                          {STATUS_LABELS[s]}
                        </button>
                      ))}
                      <button className="btn-danger" onClick={() => setSelectedOrder(null)}>Закрити</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* ===== USERS ===== */}
          {tab === 'users' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header"><h3>Користувачі ({users.length})</h3></div>
              <div className="admin-panel-card-body">
                {users.length === 0 ? (
                  <p style={{ color: '#aaa' }}>Немає користувачів</p>
                ) : (
                  <table className="admin-table">
                    <thead>
                      <tr><th>ID</th><th>Ім'я</th><th>Прізвище</th><th>Email</th><th>Телефон</th><th>Роль</th><th>Дата</th><th>Дії</th></tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.surname}</td>
                          <td>{u.email}</td>
                          <td>{u.phone || '—'}</td>
                          <td><span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>{u.role}</span></td>
                          <td>{new Date(u.created_at).toLocaleDateString('uk-UA')}</td>
                          <td>
                            {u.role !== 'admin' && (
                              <button className="btn-edit" onClick={() => handleMakeAdmin(u.email)}>Зробити адміном</button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {notification && (
        <div className={`admin-notification${notifType === 'error' ? ' error' : ''}`}>
          {notification}
        </div>
      )}
    </div>
  );
};

export default AdminPage;