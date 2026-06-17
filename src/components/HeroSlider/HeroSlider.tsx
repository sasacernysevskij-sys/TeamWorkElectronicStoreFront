import { useState } from 'react';
import './HeroSlider.css';

const slides = [
  {
    id: 1,
    image: 'https://www.mtac.ua/storage/theme/1/Wf5E9aKRCtEDD23HqJkx8vGwsD8DVdxzoolrqwWU.webp',
    subtitle: 'НОВА КОЛЕКЦІЯ',
    title: 'КРОСІВКИ SHOOTER',
    desc: 'Двокомпонентна підошва, що забезпечує легкість та стабільність під час фізичних навантажень',
  },
  {
    id: 2,
    image: 'https://www.mtac.ua/storage/theme/1/vA8e3ATO5OEp27a8T2TU5qsF2eq8BNemxKoVnVD5.webp',
    subtitle: 'M·TAC MILITARY LINE',
    title: 'MILITARY LINE',
    desc: 'Якісне спорядження для справжніх професіоналів. Надійність перевірена часом.',
  },
  {
    id: 3,
    image: 'https://www.mtac.ua/storage/theme/1/QRynvileJHIIsmPFzFxkueBAXpvvRsdFtdC5R5q3.webp',
    subtitle: 'ТАКТИЧНЕ СПОРЯДЖЕННЯ',
    title: 'TACTICAL LINE',
    desc: 'Тактичне спорядження для виконання найскладніших завдань.',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  return (
    <div className="hero-slider" style={{ backgroundImage: `url(${slides[current].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <button className="slider-btn prev" onClick={prev}>&#8592;</button>
      
      <div className="slide-content">
        <span className="slide-subtitle">{slides[current].subtitle}</span>
        <h1 className="slide-title">{slides[current].title}</h1>
        <p className="slide-desc">{slides[current].desc}</p>
        <button className="slide-btn">ДЕТАЛЬНІШЕ</button>
      </div>

      <button className="slider-btn next" onClick={next}>&#8594;</button>

      <div className="slider-dots">
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`slider-dot ${idx === current ? 'active' : ''}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroSlider;