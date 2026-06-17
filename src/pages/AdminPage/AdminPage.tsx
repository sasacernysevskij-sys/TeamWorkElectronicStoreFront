import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminPage.css';

const BASE_URL = 'http://localhost:8000';

type Tab = 'dashboard' | 'products' | 'orders' | 'users' | 'news' | 'add-product';

interface StatData {
  totalProducts: number;
  totalOrders: number;
  totalUsers: number;
  revenue: number;
}

interface OrderItem {
  id: number;
  customer: string;
  total: number;
  status: string;
  date: string;
}

interface ProductItem {
  id: number;
  name: string;
  price: number;
  category: string;
  stock: number;
}

interface UserItem {
  id: number;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

const AdminPage = () => {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<StatData | null>(null);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [users, setUsers] = useState<UserItem[]>([]);
  const [notification, setNotification] = useState('');
  const [notifType, setNotifType] = useState<'success' | 'error'>('success');

  const [prodName, setProdName] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCategory, setProdCategory] = useState('sporyadzhennya');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodSizes, setProdSizes] = useState('');

  const showNotif = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification(msg);
    setNotifType(type);
    setTimeout(() => setNotification(''), 3000);
  };

  const token = localStorage.getItem('token');
  const authHeaders = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${BASE_URL}/api/admin/stats`, { headers: authHeaders })
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setStats(d))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'orders') {
      fetch(`${BASE_URL}/api/admin/orders`, { headers: authHeaders })
        .then((r) => r.ok ? r.json() : [])
        .then((d) => { setOrders(Array.isArray(d) ? d : d.orders || []); })
        .catch(() => {});
    }
    if (tab === 'products') {
      fetch(`${BASE_URL}/api/admin/products`, { headers: authHeaders })
        .then((r) => r.ok ? r.json() : [])
        .then((d) => { setProducts(Array.isArray(d) ? d : d.products || []); })
        .catch(() => {});
    }
    if (tab === 'users') {
      fetch(`${BASE_URL}/api/admin/users`, { headers: authHeaders })
        .then((r) => r.ok ? r.json() : [])
        .then((d) => { setUsers(Array.isArray(d) ? d : d.users || []); })
        .catch(() => {});
    }
  }, [tab]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice) { showNotif('Заповніть обов\'язкові поля', 'error'); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/admin/products`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: prodName,
          price: Number(prodPrice),
          category: prodCategory,
          stock: Number(prodStock),
          description: prodDesc,
          sizes: prodSizes.split(',').map((s) => s.trim()).filter(Boolean),
        }),
      });
      if (!res.ok) throw new Error('Помилка');
      showNotif('Товар успішно додано!');
      setProdName(''); setProdPrice(''); setProdStock(''); setProdDesc(''); setProdSizes('');
      setTab('products');
    } catch {
      showNotif('Помилка додавання товару', 'error');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Видалити товар?')) return;
    try {
      const res = await fetch(`${BASE_URL}/api/admin/products/${id}`, { method: 'DELETE', headers: authHeaders });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showNotif('Товар видалено');
    } catch {
      showNotif('Помилка видалення', 'error');
    }
  };

  const navItems: { id: Tab; icon: string; label: string }[] = [
    { id: 'dashboard', icon: '', label: 'Дашборд' },
    { id: 'products', icon: '', label: 'Товари' },
    { id: 'add-product', icon: '', label: 'Додати товар' },
    { id: 'orders', icon: '', label: 'Замовлення' },
    { id: 'users', icon: '', label: 'Користувачі' },
    { id: 'news', icon: '', label: 'Новини' },
  ];

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
              onClick={() => setTab(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <Link to="/" style={{ textDecoration: 'none' }}>
            <button className="admin-nav-item">
              <span className="admin-nav-icon"></span>
              На сайт
            </button>
          </Link>
        </nav>
        <div className="admin-sidebar-footer">
          <div>Адміністратор</div>
          <div style={{ marginTop: 2, color: '#f5c518', fontSize: '11px' }}>admin@m-tac.ua</div>
        </div>
      </aside>

      <div className="admin-main">
        <div className="admin-topbar">
          <h1>{navItems.find((n) => n.id === tab)?.label || 'Адмін'}</h1>
          <div className="admin-topbar-info">
            <span>M-TAC Admin</span>
            <Link to="/">← На сайт</Link>
          </div>
        </div>

        <div className="admin-content">
          {tab === 'dashboard' && (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-card-label">Всього товарів</div>
                  <div className="stat-card-value">{stats?.totalProducts ?? '—'}</div>
                  <div className="stat-card-change"> активних</div>
                  <div className="stat-card-icon"></div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Замовлення</div>
                  <div className="stat-card-value">{stats?.totalOrders ?? '—'}</div>
                  <div className="stat-card-change"> загалом</div>
                  <div className="stat-card-icon"></div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Користувачі</div>
                  <div className="stat-card-value">{stats?.totalUsers ?? '—'}</div>
                  <div className="stat-card-change"> зареєстровано</div>
                  <div className="stat-card-icon"></div>
                </div>
                <div className="stat-card">
                  <div className="stat-card-label">Дохід</div>
                  <div className="stat-card-value">
                    {stats?.revenue ? `${stats.revenue.toLocaleString('uk-UA')} ₴` : '—'}
                  </div>
                  <div className="stat-card-change"> загалом</div>
                  <div className="stat-card-icon"></div>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-card-header">
                  <h3>Швидкі дії</h3>
                </div>
                <div className="admin-panel-card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                  <button className="btn-primary" onClick={() => setTab('add-product')}>➕ Додати товар</button>
                  <button className="btn-secondary" onClick={() => setTab('orders')}>🛒 Переглянути замовлення</button>
                  <button className="btn-secondary" onClick={() => setTab('users')}>👥 Користувачі</button>
                  <button className="btn-secondary" onClick={() => setTab('news')}>📰 Новини</button>
                </div>
              </div>

              <div className="admin-panel-card">
                <div className="admin-panel-card-header">
                  <h3>API Статус</h3>
                </div>
                <div className="admin-panel-card-body">
                  <div style={{ fontSize: 13, color: '#888' }}>
                    <p> BASE_URL: <code style={{ color: '#f5c518' }}>{BASE_URL}</code></p>
                    <p style={{ marginTop: 8 }}> Статус: Очікування підключення бекенду</p>
                    <p style={{ marginTop: 4 }}>Після підключення бекенду всі дані завантажуватимуться автоматично.</p>
                  </div>
                </div>
              </div>
            </>
          )}

          {tab === 'products' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header">
                <h3>Список товарів</h3>
                <button className="btn-primary" onClick={() => setTab('add-product')}>+ Додати товар</button>
              </div>
              <div className="admin-panel-card-body">
                {!products.length && (
                  <p style={{ color: '#aaa', fontSize: 13 }}>Товари з'являться після підключення бекенду (GET /api/admin/products)</p>
                )}
                {products.length > 0 && (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Назва</th>
                        <th>Категорія</th>
                        <th>Ціна</th>
                        <th>Залишок</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map((p) => (
                        <tr key={p.id}>
                          <td>#{p.id}</td>
                          <td>{p.name}</td>
                          <td>{p.category}</td>
                          <td>{p.price.toLocaleString('uk-UA')} грн</td>
                          <td>
                            <span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>
                              {p.stock > 0 ? `${p.stock} шт` : 'Нема'}
                            </span>
                          </td>
                          <td>
                            <button className="btn-edit">Ред.</button>
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

          {tab === 'add-product' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header">
                <h3>Додати новий товар</h3>
              </div>
              <div className="admin-panel-card-body">
                <form onSubmit={handleAddProduct} className="admin-form">
                  <div className="admin-form-group">
                    <label>Назва товару *</label>
                    <input type="text" placeholder="Назва товару" value={prodName} onChange={(e) => setProdName(e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Ціна (грн) *</label>
                    <input type="number" placeholder="0" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Категорія</label>
                    <select value={prodCategory} onChange={(e) => setProdCategory(e.target.value)}>
                      <option value="sporyadzhennya">Спорядження та екіпіровка</option>
                      <option value="vzuttya">Взуття</option>
                      <option value="odyag">Одяг</option>
                      <option value="taktychne">Тактичне спорядження</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label>Залишок на складі</label>
                    <input type="number" placeholder="0" value={prodStock} onChange={(e) => setProdStock(e.target.value)} />
                  </div>
                  <div className="admin-form-group">
                    <label>Розміри (через кому)</label>
                    <input type="text" placeholder="XS, S, M, L, XL, 2XL" value={prodSizes} onChange={(e) => setProdSizes(e.target.value)} />
                  </div>
                  <div className="admin-form-group full">
                    <label>Опис товару</label>
                    <textarea placeholder="Опис товару..." value={prodDesc} onChange={(e) => setProdDesc(e.target.value)} />
                  </div>
                  <div className="admin-form-actions">
                    <button type="submit" className="btn-primary">Додати товар</button>
                    <button type="button" className="btn-secondary" onClick={() => setTab('products')}>Скасувати</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {tab === 'orders' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header">
                <h3>Замовлення</h3>
              </div>
              <div className="admin-panel-card-body">
                {!orders.length && (
                  <p style={{ color: '#aaa', fontSize: 13 }}>Замовлення з'являться після підключення бекенду (GET /api/admin/orders)</p>
                )}
                {orders.length > 0 && (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Клієнт</th>
                        <th>Сума</th>
                        <th>Статус</th>
                        <th>Дата</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.customer}</td>
                          <td>{o.total.toLocaleString('uk-UA')} грн</td>
                          <td>
                            <span className={`badge ${
                              o.status === 'delivered' ? 'badge-green' :
                              o.status === 'processing' ? 'badge-yellow' :
                              o.status === 'cancelled' ? 'badge-red' : 'badge-blue'
                            }`}>{o.status}</span>
                          </td>
                          <td>{new Date(o.date).toLocaleDateString('uk-UA')}</td>
                          <td><button className="btn-edit">Деталі</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === 'users' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header">
                <h3>Користувачі</h3>
              </div>
              <div className="admin-panel-card-body">
                {!users.length && (
                  <p style={{ color: '#aaa', fontSize: 13 }}>Користувачі з'являться після підключення бекенду (GET /api/admin/users)</p>
                )}
                {users.length > 0 && (
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Ім'я</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Дата реєстрації</th>
                        <th>Дії</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((u) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <span className={`badge ${u.role === 'admin' ? 'badge-red' : 'badge-blue'}`}>{u.role}</span>
                          </td>
                          <td>{new Date(u.createdAt).toLocaleDateString('uk-UA')}</td>
                          <td><button className="btn-edit">Деталі</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {tab === 'news' && (
            <div className="admin-panel-card">
              <div className="admin-panel-card-header">
                <h3>Управління новинами</h3>
                <button className="btn-primary">+ Додати новину</button>
              </div>
              <div className="admin-panel-card-body">
                <p style={{ color: '#aaa', fontSize: 13 }}>
                  Новини завантажуватимуться з бекенду (GET /api/admin/news).<br />
                  Після підключення тут з'явиться таблиця з новинами та можливістю редагування.
                </p>
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