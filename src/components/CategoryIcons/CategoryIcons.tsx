import { Link } from 'react-router-dom';
import './CategoryIcons.css';

const categories = [
  { img: 'https://www.mtac.ua/storage/category/el_catalog/27815d603a5411f08120aab9975c17d0/triyka.png', label: 'ТРІЙКА РЕКОМЕНДУЄ', to: '/novynky' },
  { img: 'https://www.mtac.ua/storage/category/el_catalog/a43d11df20b311ef8115aab9975c17d0/sporyadzhennya-ta-ekipirovka.png', label: 'СПОРЯДЖЕННЯ ТА ЕКІПІРОВКА', to: '/sporyadzhennya-ta-ekipirovka' },
  { img: 'https://www.mtac.ua/storage/category/el_catalog/a905097b20b011ef8115aab9975c17d0/vzuttya.png', label: 'ВЗУТТЯ', to: '/vzuttya' },
  { img: 'https://www.mtac.ua/storage/category/el_catalog/f8ba9f1a20bd11ef8115aab9975c17d0/odyag.png', label: 'ОДЯГ', to: '/odyag' },
  { img: 'https://www.mtac.ua/storage/category/el_catalog/1e539dc120be11ef8115aab9975c17d0/taktichne-sporyadzhennya.png', label: 'ТАКТИЧНЕ СПОРЯДЖЕННЯ', to: '/taktychne' },
  { img: 'https://www.mtac.ua/themes/shop/store/build/assets/sale-c4643596.png', label: 'SALE', to: '/' },
];

const promoBanners = [
  {
    title: 'MILITARY LINE',
    img: 'https://www.mtac.ua/storage/line-images/0afc237b799011ef8117aab9975c17d0/oy64gxatglyq862c3cg66wi0a1ily8xn.jpg',
    to: '/odyag',
  },
  {
    title: 'TACTICAL LINE',
    img: 'https://www.mtac.ua/storage/line-images/24e02a14799011ef8117aab9975c17d0/Image.jpg',
    to: '/taktychne',
  },
  {
    title: 'MORALE PATCHES',
    img: 'https://www.mtac.ua/storage/line-images/0943efd092be11ef8117aab9975c17d0/photo_2024-10-15_09-56-05.jpg',
    to: '/sporyadzhennya-ta-ekipirovka',
  },
];

const CategoryIcons = () => {
  return (
    <div className="category-icons-section">
      <div className="category-icons-grid">
        {categories.map((cat, idx) => (
          <Link key={idx} to={cat.to} className="cat-icon-item">
            <div className="cat-icon-circle">
              <img src={cat.img} alt={cat.label} />
            </div>
            <div className="cat-icon-label">{cat.label}</div>
          </Link>
        ))}
      </div>

      <div className="promo-banners">
        {promoBanners.map((banner, idx) => (
          <Link key={idx} to={banner.to} className="promo-banner">
            <div className="promo-banner-bg" style={{ backgroundImage: `url(${banner.img})` }} />
            <div className="promo-banner-content">
              <div className="promo-banner-accent"></div>
              <div className="promo-banner-title">{banner.title}</div>
              <span style={{ color: '#f5c518', fontSize: '12px', fontWeight: 'bold', marginTop: '5px', display: 'inline-block' }}>
                ДЕТАЛЬНІШЕ &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="lookbook-section-wrapper">
        <Link to="/" className="lookbook-banner">
          <img src="https://www.mtac.ua/themes/shop/store/build/assets/lookbook-a0eeaba8.jpg" alt="Look Book" className="lookbook-img" />
          <div className="lookbook-overlay-text">LOOK BOOK</div>
        </Link>
      </div>
    </div>
  );
};

export default CategoryIcons;