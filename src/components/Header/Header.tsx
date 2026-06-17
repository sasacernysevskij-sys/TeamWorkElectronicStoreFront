import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import BalanceIcon from '@mui/icons-material/Balance';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import './Header.css';

interface HeaderProps {
  onLoginClick: () => void;
  onRegisterClick: () => void;
  user: { name: string; token: string } | null;
  onLogout: () => void;
}

const Header = ({ onLoginClick, onRegisterClick, user, onLogout }: HeaderProps) => {
  const [searchVal, setSearchVal] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`${location.pathname}?q=${encodeURIComponent(searchVal)}`);
    }
  };

  return (
    <header className="header-wrapper">
      <div className="header-topbar">
        <nav className="topbar-nav">
          <Link to="/merezhа" className="active">Мережа магазинів</Link>
          <Link to="/pro-brend">Про бренд</Link>
          <Link to="/materialy">Матеріали</Link>
          <Link to="/ohlyady">Огляди</Link>
          <Link to="/videoohlyd">Відеоогляд</Link>
          <Link to="/novyny">Новини</Link>
          <Link to="/spivpratsya">Співпраця</Link>
          <Link to="/kontakty">Контакти</Link>
        </nav>
        <div className="topbar-auth">
          {user ? (
            <>
              <span className="topbar-auth-btn" style={{ color: '#f5c518' }}>
                <AccountCircleOutlinedIcon fontSize="small" />
                {user.name}
              </span>
              <button className="topbar-auth-btn" onClick={onLogout}>Вийти</button>
            </>
          ) : (
            <>
              <button className="topbar-auth-btn" onClick={onLoginClick}>
                <AccountCircleOutlinedIcon fontSize="small" />
                Увійти
              </button>
              <button className="topbar-auth-btn register" onClick={onRegisterClick}>
                Реєстрація
              </button>
            </>
          )}
        </div>
      </div>

      <div className="header-middle">
        <Link to="/" className="header-logo">
          <div className="logo-box">
            M<span className="logo-dot">·</span>TAC
          </div>
        </Link>

        <form className="header-search" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Шукати продукти тут"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
          />
          <button type="submit">
            <SearchIcon fontSize="small" />
          </button>
        </form>

        <div className="header-phones">
          <a href="tel:+380675794850">+38 (067) 579-48-50</a>
          <a href="tel:+380443344988">+38 (044) 334-49-88</a>
        </div>

        <div className="header-actions">
          <button className="header-icon-btn">
            <FavoriteBorderIcon />
          </button>
          <button className="header-icon-btn">
            <BalanceIcon />
          </button>
          <button className="header-icon-btn">
            <ShoppingCartOutlinedIcon />
            <span className="cart-badge">0</span>
          </button>
          <button className="header-icon-btn mobile-menu-btn">
            <MenuIcon />
          </button>
        </div>
      </div>

      <nav className="header-nav">
        <ul>
          <li><Link to="/novynky">НОВИНКИ</Link></li>
          <li><Link to="/sporyadzhennya-ta-ekipirovka">СПОРЯДЖЕННЯ ТА ЕКІПІРОВКА</Link></li>
          <li><Link to="/vzuttya">ВЗУТТЯ</Link></li>
          <li><Link to="/odyag">ОДЯГ</Link></li>
          <li><Link to="/taktychne">ТАКТИЧНЕ СПОРЯДЖЕННЯ</Link></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;