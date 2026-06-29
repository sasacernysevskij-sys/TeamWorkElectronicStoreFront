import { useState } from 'react';
import './AuthModal.css';

const BASE_URL = 'http://localhost:8000';

interface AuthModalProps {
  open: boolean;
  mode: 'login' | 'register';
  onClose: () => void;
  onSwitchMode: (mode: 'login' | 'register') => void;
  onSuccess: (user: { name: string; token: string; role?: string }) => void;
}

const AuthModal = ({ open, mode, onClose, onSwitchMode, onSuccess }: AuthModalProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forgotMode, setForgotMode] = useState(false);

  if (!open) return null;

  const resetFields = () => {
    setEmail(''); setPassword(''); setFirstName('');
    setLastName(''); setConfirmPassword(''); setPhone('');
    setError(''); setSuccess(''); setForgotMode(false);
  };

  const handleSwitch = (m: 'login' | 'register') => {
    resetFields();
    onSwitchMode(m);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Заповніть усі поля'); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Помилка авторизації');
      onSuccess({ 
        name: data.user?.name || data.user?.firstName || email, 
        token: data.token,
        role: data.user?.role 
      });
      resetFields();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка сервера');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!firstName || !lastName || !email || !password || !phone) {
      setError('Заповніть усі обов\'язкові поля'); return;
    }
    if (password !== confirmPassword) { setError('Паролі не збігаються'); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: firstName, surname: lastName, email, password, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Помилка реєстрації');
      setSuccess('Реєстрацію успішно завершено! Тепер увійдіть.');
      setTimeout(() => handleSwitch('login'), 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка сервера');
    }
  };
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) { setError('Введіть email'); return; }
    try {
      const res = await fetch(`${BASE_URL}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error('Помилка');
      setSuccess('Посилання для скидання пароля надіслано на пошту');
      setTimeout(() => { resetFields(); onClose(); }, 2000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Помилка сервера');
    }
  };

  return (
    <div className="auth-overlay" onClick={(e) => { if (e.target === e.currentTarget) { onClose(); resetFields(); } }}>
      <div className="auth-modal">
        <button className="auth-close" onClick={() => { onClose(); resetFields(); }}>×</button>

        <h2 className="auth-title">
          {forgotMode ? 'СКИДАННЯ ПАРОЛЯ' : mode === 'login' ? 'АВТОРИЗАЦІЯ' : 'РЕЄСТРАЦІЯ'}
        </h2>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {forgotMode ? (
          <form onSubmit={handleForgotPassword}>
            <div className="auth-field">
              <label>Електронна пошта <span>*</span></label>
              <input
                type="email"
                placeholder="Введіть email для відновлення"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="auth-submit-btn">ВІДНОВИТИ ПАРОЛЬ</button>
            <div className="auth-switch">
              <button type="button" onClick={() => setForgotMode(false)}>← Назад до входу</button>
            </div>
          </form>
        ) : mode === 'login' ? (
          <form onSubmit={handleLogin}>
            <div className="auth-field">
              <label>Електронна пошта або номер телефону <span>*</span></label>
              <input
                type="text"
                placeholder="Електронна пошта або номер телефону"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Пароль <span>*</span></label>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit-btn">ВІДПРАВИТИ</button>

            <div className="auth-switch">
              <button type="button" onClick={() => setForgotMode(true)}>Забули пароль?</button>
            </div>
            <div className="auth-switch">
              Ще немає облікового запису?{' '}
              <button type="button" onClick={() => handleSwitch('register')}>Реєстрація</button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="auth-field">
              <label>Прізвище <span>*</span></label>
              <input
                type="text"
                placeholder="Прізвище"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Ім'я <span>*</span></label>
              <input
                type="text"
                placeholder="Ім'я"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Електронна пошта <span>*</span></label>
              <input
                type="email"
                placeholder="Електронна пошта"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Пароль <span>*</span></label>
              <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Підтвердіть пароль <span>*</span></label>
              <input
                type="password"
                placeholder="Підтвердіть пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <div className="auth-field">
              <label>Телефон <span>*</span></label>
              <input
                type="tel"
                placeholder="Номер телефону"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <button type="submit" className="auth-submit-btn">ВІДПРАВИТИ</button>

            <div className="auth-switch">
              Вже є обліковий запис?{' '}
              <button type="button" onClick={() => handleSwitch('login')}>Увійти</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;