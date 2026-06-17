import React from 'react';
import HeroSlider from '../../components/HeroSlider/HeroSlider';
import CategoryIcons from '../../components/CategoryIcons/CategoryIcons';
import NewProducts from '../../components/NewProducts/NewProducts';
import NewsSection from '../../components/NewsSection/NewsSection';
import './HomePage.css';

interface HomePageProps {
  onRegisterClick?: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onRegisterClick }) => {
  return (
    <div className="home-page">
      <HeroSlider />
      <CategoryIcons />
      <NewProducts />
      <NewsSection />
    </div>
  );
};

export default HomePage;