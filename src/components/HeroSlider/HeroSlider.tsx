import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeroSlider.css';

const slides = [
  {
    id: 1,
    image: 'https://www.mtac.ua/storage/theme/1/Wf5E9aKRCtEDD23HqJkx8vGwsD8DVdxzoolrqwWU.webp',
    subtitle: 'НОВА КОЛЕКЦІЯ',
    title: 'КРОСІВКИ SHOOTER',
    desc: 'Двокомпонентна підошва, що забезпечує легкість та стабільність під час фізичних навантажень',
    search: 'кросівки Shooter',
  },
  {
    id: 2,
    image: 'https://www.mtac.ua/storage/theme/1/vA8e3ATO5OEp27a8T2TU5qsF2eq8BNemxKoVnVD5.webp',
    subtitle: 'NYCO EXTREME',
    title: 'M-Tac шорти Sturm Gen.II',
    desc: 'додатковий шар тканини у місцяях протирання, еластичні вставки в зоні попереку та стегна',
    search: 'M-Tac шорти Sturm Gen.II',
  },
  {
    id: 3,
    image: 'https://www.mtac.ua/storage/theme/1/DVy7bsRHcXO9NugtEpGGRWRnEubsI3wMRClzPYpI.webp',
    subtitle: 'M-TAC',
    title: 'M-TAC Сумка Транспорта 185л.',
    desc: 'Найкраща сумка у світі',
    search: 'M-Tac сумка транспортна 185л',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const navigate = useNavigate();

  const prev = () => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === slides.length - 1 ? 0 : c + 1));

  const handleDetails = () => {
    navigate(`/search?q=${encodeURIComponent(slides[current].search)}`);
  };

  return (
    <div className="hero-slider" style={{ backgroundImage: `url(${slides[current].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <button className="slider-left" onClick={prev}>&#8592;</button>
      
      <div className="slide-content">
        <span className="slide-subtitle">{slides[current].subtitle}</span>
        <h1 className="slide-title">{slides[current].title}</h1>
        <p className="slide-desc">{slides[current].desc}</p>
        <button className="slide-btn" onClick={handleDetails}>ДЕТАЛЬНІШЕ</button>
      </div>

      <button className="slider-right" onClick={next}>&#8594;</button>

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