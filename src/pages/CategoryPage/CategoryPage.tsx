import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/ProductCard/ProductCard';
import './CategoryPage.css';

const BASE_URL = 'http://localhost:8000';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  sizes?: string[];
  category?: string;
}

interface CategoryPageProps {
  category: string;
  title: string;
}

interface TypeItem {
  icon: string; // url
  label: string;
}

const categoryTypes: Record<string, TypeItem[]> = {
  sporyadzhennya: [
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/b93fc9da20b311ef8115aab9975c17d0/5650ec90bfc112241842108190394c5d.png', label: 'Нашивки, патчі, кокарди та погони' },
    { icon: 'https://www.mtac.ua/storage/category/103/opiAxpSurE7p7s6eu0kxjP7bohZF3BrrmajDucf1.webp', label: 'Ножі та інструменти' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/02bb4a106d1311ef8117aab9975c17d0/43395029d51887cd5d6ad80275c3283e.png', label: 'Годинники' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/70e651bd6d1411ef8117aab9975c17d0/8dd619adfc0c1e3b23fe5b0b818682d8.png', label: 'Рюкзаки, сумки, баули' },
    { icon: 'https://www.mtac.ua/storage/category/110/6QGXLPYfcrGDLj8QlqQIX4my2tL9ZUxQZwUWrGYm.webp', label: 'Прапори' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/3b79612c6e1411ef8117aab9975c17d0/b240ab546770defff3587bee22badeab%20(1).png', label: 'Компаси' },
    { icon: 'https://www.mtac.ua/storage/category/122/NKZm012CPpXhf3oiRI8vCUG5wz4Zc0E3vNQfLFsU.webp', label: 'Бівачне спорядження' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/30d8e8866e8711ef8117aab9975c17d0/b204d9da29939b25378d3a80c10d8416.png', label: 'Фляги та гідросистеми' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/c1e69a2d6e8711ef8117aab9975c17d0/k2dgwdp8vpbm0gix0l1ish4bppvxsjgy.png', label: 'Армійські жетони' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/2be15afd6e8f11ef8117aab9975c17d0/133c625375fd7a27ae1a95860f0bc416.png', label: 'Ліхтарі й аксесуари' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/00000000000000000000000000000000/70143186707710f52cc85b4a1040531e.png', label: 'Засоби маскування' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/00000000000000000000000000000000/70fcd8e406b21c780232eed575c86cc3.png', label: 'Сувеніри' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/221d3116818211ef8117aab9975c17d0/26c0b336aac257330b0e89c74ac349ee.png', label: 'Браслети з паракорду' },
  ],
  vzuttya: [
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/b9eed66320b511ef8115aab9975c17d0/86d079c474d1b453778126e311354b1c%20(1).png', label: 'Аксесуари для взуття' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/beb5ce5420b011ef8115aab9975c17d0/fcbfa3e2e381a8ba19d9c72c2238d1ef.png', label: 'Взуття' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/abeaa22520b511ef8115aab9975c17d0/b05591ff5877c906ad4164778594716f.png', label: 'Гамаші' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/8ca6eb6120b511ef8115aab9975c17d0/a46594600cf312c80b96c65570748703.png', label: 'Устілки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/97be7c8b20b511ef8115aab9975c17d0/145dc6bd0ab55522caa4dcf81b294baa.png', label: 'Шнурки' },
  ],
  odyag: [
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/f52fb1b020d311ef8115aab9975c17d0/cdf0cf88aef262ebd3fb344f0d61768b.png', label: 'Штани' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/c6e3fa5c3c5f11ef8115aab9975c17d0/714466358966263d4163c52d9200d0ad%20(1).png', label: 'Футболки, майки, пончо' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/5bc43953421911ef8115aab9975c17d0/a7234bf89a93fb92d0279403f7609994.png', label: 'Рукавиці' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/7ef3b18b421911ef8115aab9975c17d0/5e58a3a002781a73d88bb8d22681d72b.png', label: 'Шорти' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/a3c467c6421911ef8115aab9975c17d0/4e5e057e5e6d25e04b2b60315bf28563.png', label: 'Куртки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/b9077752421911ef8115aab9975c17d0/206b5ed25ffa6a91babae6d1de800df6.png', label: 'Флісові кофти' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/c76b0922421911ef8115aab9975c17d0/1e1d1d3fa23b78236238a97f46437a1e.png', label: 'Толстовки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/d795fd70421911ef8115aab9975c17d0/278864bc5888eedcba17c80f99d6e83d%20(1).png', label: 'Сорочки, кітелі' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/e841af5c421911ef8115aab9975c17d0/9778a3e1536e8b918533abc5e706e672.png', label: 'Термобілизна' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/f26f951b421911ef8115aab9975c17d0/ab187313d2f5b472abafd345dce1da40.png', label: 'Головні убори' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/05872d7c421a11ef8115aab9975c17d0/16fd8248d8c90de82a09547a1267748c.png', label: 'Шарфи, шемаги' },
    { icon: 'https://www.mtac.ua/storage/category/16602b7b421a11ef8115aab9975c17d0/87cae4b47927fd29ed11950df8ae9e90.png', label: 'Шарф-труби' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/25eb5f8a421a11ef8115aab9975c17d0/eeb2c5636a0213fd26a7aca0a7cc0fd6.png', label: 'Кофти' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/31d98022421a11ef8115aab9975c17d0/bb7ec47a63470b4466b415d756afdcba.png', label: 'Пончо' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/41de4d63421a11ef8115aab9975c17d0/914683a009e92bcb822d444f7f2e4b60.png', label: 'Жіночий одяг' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/5590dc7f421a11ef8115aab9975c17d0/2865378c0edb3dbc446fb987a149177d.png', label: 'Жилети' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/77ec1ef9421a11ef8115aab9975c17d0/15c0336996029dff473788631d7e1d40.png', label: 'Маскувальний одяг' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/caf7a2b0706c11ef8117aab9975c17d0/276d32863386f0aefe5a5310844b6333.png', label: 'Шкарпетки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/00000000000000000000000000000000/390a08ff99300a995cf5be0e3ce9e43f.png', label: 'Засоби для ремонту' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/00000000000000000000000000000000/8703a2396c73c3accc363b9e599b6806%20(1).png', label: 'Ремені, підтяжки' },
  ],
  taktychne: [
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/289f0af420d311ef8115aab9975c17d0/4c3d5cdbe2a19b43bd0a7282f8ada1e9.png', label: 'Чистка та догляд за зброєю' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/0535ed2020bf11ef8115aab9975c17d0/215d419a11b39ad8917efb30097c8283.png', label: 'Елементи до плитоносок' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/ff02800b20d211ef8115aab9975c17d0/b699d298a04579c318825ae90d3d8121%20(1).png', label: 'Балістичний захист' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/88848b5e20d211ef8115aab9975c17d0/48dd6c7649b95159c9e50bb85b539275.png', label: 'Збройові ремені' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/592e3dd820c011ef8115aab9975c17d0/0725a9b2d9eca4fc62c9c6f0b67514ec.png', label: 'Карабіни, гримлоки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/551e334720d211ef8115aab9975c17d0/a6309a9041111bb83c3fac97ed97b749.png', label: 'Килимки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/c49daaa820d211ef8115aab9975c17d0/7b8bfcea6278b607ce5a34c93b0c4fd1.png', label: 'Кобури' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/7423e92e20d211ef8115aab9975c17d0/8f1908e3f9bbdbfcd97b84688dd4aab3.png', label: 'Муфти Тактичні' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/a8f9751c20bf11ef8115aab9975c17d0/99a28d6f045c0470a24bdce9fee18e03.png', label: 'Набедрені платформи' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/a632edca20d211ef8115aab9975c17d0/80cb90cff5e2fd44543d362a090bef30.png', label: 'Наколінники та налокітники' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/4381be9320bf11ef8115aab9975c17d0/32a11ebdce8beb4989f90315bbbda472.png', label: 'Підсумки' },
    { icon: 'https://www.mtac.ua/storage/category/el_catalog/20f92f8320bf11ef8115aab9975c17d0/f4efca98b2f9cf53c3a5bb45f5cd0f0c%20(1).png', label: 'Плитоноски (PLATE CARRIER) та Бронежилети' },
  ],
  novynky: [],
};

const CategoryPage = ({ category, title }: CategoryPageProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [priceMax, setPriceMax] = useState(21347);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 12;

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch(`${BASE_URL}/api/products?category=${category}&page=${page}&limit=${limit}`)
      .then((res) => {
        if (!res.ok) throw new Error('Не вдалося завантажити товари');
        return res.json();
      })
      .then((data) => {
        const items = Array.isArray(data) ? data : data.products || [];
        setProducts(items);
        setTotalPages(data.totalPages || 1);
        setLoading(false);
      })
      .catch(() => {
        setError('Бекенд ще не підключено. Товари з\'являться після підключення API.');
        setLoading(false);
      });
  }, [category, page]);

  const types = categoryTypes[category] || [];

  return (
    <div className="category-page">
      {/* Hero */}
      <div className="category-hero">
        <div className="category-hero-bg" style={{ backgroundImage: 'url(https://www.mtac.ua/themes/shop/store/build/assets/breadcrumbs-back-b7c8e5d7.jpg)' }} />
        <div className="category-hero-content">
          <h1 className="category-hero-title">{title}</h1>
          <div className="breadcrumb">
            <Link to="/">Головна</Link>
            <span>»</span>
            <span>{title}</span>
          </div>
        </div>
      </div>

      <div className="category-layout">
        {/* Sidebar Filters */}
        <aside className="category-sidebar">
          <div className="filter-section">
            <div className="filter-label">ФІЛЬТРИ:</div>
          </div>

          <div className="filter-section">
            <div className="filter-title-row">
              <span className="filter-title">ЦІНА</span>
              <button className="filter-toggle">−</button>
            </div>
            <div className="price-slider-wrap">
              <input
                type="range"
                min={0}
                max={21347}
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="price-slider"
              />
              <div className="price-range-display">
                <input type="text" value="0" readOnly />
                <input type="text" value={priceMax} readOnly />
              </div>
            </div>
          </div>

          {['КОЛІР', 'РОЗМІР', 'СТИКЕРИ', 'МАТЕРІАЛ', 'МОДЕЛЬ', 'ГРУПА КРОВІ', 'ТИП КРІПЛЕННЯ', 'ТИП ЗАМКУ'].map((f) => (
            <div className="filter-section" key={f}>
              <div className="filter-title-row">
                <span className="filter-title">{f}</span>
                <button className="filter-toggle">+</button>
              </div>
            </div>
          ))}
        </aside>

        {/* Products Area */}
        <div className="category-products">
          {/* Category sub types */}
          {types.length > 0 && (
            <div className="category-types-section">
              <div className="category-types-grid">
                {types.map((t) => (
                  <a key={t.label} className="cat-type-card" href="#">
                    <img src={t.icon} alt={t.label} className="cat-type-icon" />
                    <span>{t.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Sort bar */}
          <div className="sort-bar">
            <span className="sort-label">СОРТУВАТИ:</span>
            <button className="sort-btn active">популярні</button>
            <button className="sort-btn">по зростанню ціни</button>
            <button className="sort-btn">по зменшенню ціни</button>
          </div>

          {/* Products Grid */}
          {loading && <div className="loading-placeholder" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Завантаження товарів...</div>}
          {error && <div style={{ textAlign: 'center', padding: '40px', color: '#aaa', fontSize: '14px' }}>{error}</div>}
          {!loading && !error && products.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>Товари не знайдено</div>
          )}
          {!loading && products.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`page-btn${p === page ? ' active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;