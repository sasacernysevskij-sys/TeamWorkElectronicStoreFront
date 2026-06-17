import { useEffect, useState } from 'react';
import './NewsSection.css';

const BASE_URL = 'http://localhost:8000';

interface NewsItem {
  id: number;
  title: string;
  description: string;
  date: string;
  image?: string;
}

const defaultNews: NewsItem[] = [
  {
    id: 101,
    title: 'Оновлення зимового асортименту',
    description: 'Зустрічайте нові надходження найтепліших курток та флісових кофт серії Military Line.',
    date: '2026-02-15',
    image: 'https://www.mtac.ua/storage/blog-images/678/XwOLWb5svwgPwcFyJKIe7X2CrHu2kM1egmsKhbQa.webp'
  },
  {
    id: 102,
    title: 'Технологічні новинки взуття',
    description: 'Нове покоління кросівок Shooter вже на складі. Двокомпонентна підошва для екстремальних умов.',
    date: '2026-02-10',
    image: 'https://www.mtac.ua/storage/blog-images/675/APHnOmQOsmR6B4mngumo8RRRjEbnniMj7ZB0jyhy.webp'
  }
];

const defaultReviews: NewsItem[] = [
  {
    id: 201,
    title: 'Огляд плитоноски Plate Carrier',
    description: 'Детальний розбір анатомічної посадки, надійності фурнітури та балістичного захисту комплекту.',
    date: '2026-02-14',
    image: 'https://www.mtac.ua/storage/blog-images/687/koQF7oUrrwXGNlJoZlndkSojHA9iK0Pg4QkYkZso.webp'
  },
  {
    id: 202,
    title: 'Відеоогляд тактичного рюкзака',
    description: 'Тестуємо місткість, ергономіку та модульні системи кріплення підсумків на практиці.',
    date: '2026-02-08',
    image: 'https://www.mtac.ua/storage/blog-images/688/H3h0o4zDMvV3kGuQqbVkNF3EiKsWhLOXQhYJG0TC.webp'
  }
];

const NewsSection = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [reviews, setReviews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${BASE_URL}/api/news?limit=2`).then(r => r.ok ? r.json() : []).catch(() => []),
      fetch(`${BASE_URL}/api/reviews?limit=2`).then(r => r.ok ? r.json() : []).catch(() => []),
    ]).then(([newsData, reviewsData]) => {
      const parsedNews = Array.isArray(newsData) ? newsData : newsData.items || [];
      const parsedReviews = Array.isArray(reviewsData) ? reviewsData : reviewsData.items || [];
      
      setNews(parsedNews.length > 0 ? parsedNews : defaultNews);
      setReviews(parsedReviews.length > 0 ? parsedReviews : defaultReviews);
      setLoading(false);
    });
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? dateStr : d.toLocaleDateString('uk-UA');
  };

  const renderCard = (item: NewsItem) => {
    return (
      <div key={item.id} className="news-card">
        <div className="news-date">{formatDate(item.date)}</div>
        <div className="news-image-wrap">
          {item.image ? (
            <img src={item.image} alt={item.title} />
          ) : (
            <div className="news-image-placeholder">📰</div>
          )}
        </div>
        <div className="news-title">{item.title}</div>
        <div className="news-desc">{item.description}</div>
        <button className="news-more">ДЕТАЛЬНІШЕ</button>
      </div>
    );
  };

  return (
    <section className="news-section">
      <div className="news-section-inner">
        <div className="news-block">
          <h2>НОВИНИ</h2>
          {loading && <p style={{ color: '#888', fontSize: '14px' }}>Завантаження...</p>}
          {!loading && (
            <div className="news-list">
              {news.map(renderCard)}
            </div>
          )}
        </div>

        <div className="reviews-block">
          <h2>ОСТАННІ ОГЛЯДИ</h2>
          {loading && <p style={{ color: '#888', fontSize: '14px' }}>Завантаження...</p>}
          {!loading && (
            <div className="news-list">
              {reviews.map(renderCard)}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsSection;