import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('Дякуємо за підписку!');
    setName(''); setEmail('');
  };

  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-store">
          <h3>Знайдіть найближчий для вас магазин, де ви можете придбати товари нашого виробництва</h3>
          <div className="footer-store-icon">🗺️</div>
          <a href="#" className="footer-store-btn">ЗНАЙТИ МАГАЗИН</a>
        </div>
        <div className="footer-newsletter">
          <h3>Підпишіться на розсилку наших новин і оглядів, та отримуйте першими нову інформацію про наші товари</h3>
          <form onSubmit={handleSubscribe}>
            <div className="newsletter-field">
              <label>Ваше ім'я</label>
              <input
                type="text"
                placeholder="Введіть ваше ім'я"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="newsletter-field">
              <label>E-mail</label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button type="submit" className="newsletter-btn">ПІДПИСАТИСЯ</button>
          </form>
        </div>
      </div>

      <div className="footer-links">
        <div className="footer-col">
          <h4>ІНФОРМАЦІЯ</h4>
          <ul>
            <li><Link to="/">Про нас</Link></li>
            <li><Link to="/">Зв'яжіться з нами</Link></li>
            <li><Link to="/">Служба підтримки</Link></li>
            <li><Link to="/">Новини</Link></li>
            <li><Link to="/">Відеоогляди</Link></li>
            <li><Link to="/">Інформація про продавця</Link></li>
          </ul>
        </div>
        <div className="footer-col">
          <h4>БРЕНД М-ТАС</h4>
          <ul>
            <li><Link to="/">Угода користувача</Link></li>
            <li><Link to="/">Оплата</Link></li>
            <li><Link to="/">Доставка</Link></li>
            <li><Link to="/">Обмін і повернення товару</Link></li>
            <li><Link to="/">Співпраця</Link></li>
            <li><Link to="/">Мапа сайту</Link></li>
          </ul>
        </div>
        <div className="footer-col footer-contacts">
          <h4>НАШІ КОНТАКТИ</h4>
          <p>+38 (067) 579-48-50</p>
          <p>+38 (044) 334-49-88</p>
          <p className="email">E-mail: sale@m-tac.ua</p>
          <p className="address">Адреса: Київ, вул. Віктора Некрасова</p>
          <div className="footer-socials">
            <a href="#" className="footer-social-link">f</a>
            <a href="#" className="footer-social-link">in</a>
            <a href="#" className="footer-social-link">▶</a>
            <a href="#" className="footer-social-link">tt</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 M-TAC. Всі права захищені.</span>
      </div>
    </footer>
  );
};

export default Footer;