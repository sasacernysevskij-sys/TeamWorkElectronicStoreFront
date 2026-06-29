import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import HomePage from './pages/HomePage/HomePage';
import CategoryPage from './pages/CategoryPage/CategoryPage';
import AdminPage from './pages/AdminPage/AdminPage';
import AuthModal from './components/AuthModal/AuthModal';
import CartPage from './pages/CartPage/CartPage';
import FavoritesPage from './pages/FavoritePage/FavoritePage';
import OrdersPage from './pages/OrdersPage/OrdersPage';
import ComparePage from './pages/ComparePage/ComparePage';
import SearchPage from './pages/SearchPage/SearchPage';
import { useState } from 'react';

function App() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [user, setUser] = useState<{ name: string; token: string; role?: string } | null>(null);

  const openLogin = () => { setAuthMode('login'); setAuthOpen(true); };
  const openRegister = () => { setAuthMode('register'); setAuthOpen(true); };
  const closeAuth = () => setAuthOpen(false);

  const handleAuthSuccess = (userData: { name: string; token: string; role?: string }) => {
    setUser(userData);
    setAuthOpen(false);
    localStorage.setItem('token', userData.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <BrowserRouter>
      <div className="page-wrapper">
        <Header
          onLoginClick={openLogin}
          onRegisterClick={openRegister}
          user={user}
          onLogout={handleLogout}
        />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage onRegisterClick={openRegister} />} />
            <Route path="/sporyadzhennya-ta-ekipirovka" element={<CategoryPage category="sporyadzhennya" title="СПОРЯДЖЕННЯ ТА ЕКІПІРОВКА" />} />
            <Route path="/vzuttya" element={<CategoryPage category="vzuttya" title="ВЗУТТЯ" />} />
            <Route path="/odyag" element={<CategoryPage category="odyag" title="ОДЯГ" />} />
            <Route path="/taktychne" element={<CategoryPage category="taktychne" title="ТАКТИЧНЕ СПОРЯДЖЕННЯ" />} />
            <Route path="/novynky" element={<CategoryPage category="novynky" title="НОВИНКИ" />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/compare" element={<ComparePage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/search" element={<SearchPage />} />
          </Routes>
        </main>
        <Footer />
        <AuthModal
          open={authOpen}
          mode={authMode}
          onClose={closeAuth}
          onSwitchMode={(m) => setAuthMode(m)}
          onSuccess={handleAuthSuccess}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;