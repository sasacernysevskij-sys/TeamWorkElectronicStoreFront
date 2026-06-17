import BalanceIcon from '@mui/icons-material/Balance';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image?: string;
  sizes?: string[];
  category?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const sizes = product.sizes || [];

  const handleBuy = () => {
    alert(`Товар "${product.name}" додано до кошика`);
  };

  return (
    <div className="product-card">
      <div className="product-image-wrap">
        {product.image ? (
          <img src={product.image} alt={product.name} className="product-image" />
        ) : (
          <div className="product-image-placeholder"></div>
        )}
        <div className="product-actions-overlay">
          <button className="product-action-btn">
            <BalanceIcon fontSize="small" />
          </button>
          <button className="product-action-btn fav">
            <FavoriteBorderIcon fontSize="small" />
          </button>
        </div>
      </div>

      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div className="product-price">
          {product.price.toLocaleString('uk-UA')} <span>грн</span>
        </div>
        {sizes.length > 0 && (
          <div className="product-sizes">
            {sizes.map((s) => (
              <span key={s} className="size-tag">{s}</span>
            ))}
          </div>
        )}
        <button className="product-buy-btn" onClick={handleBuy}>КУПИТИ</button>
      </div>
    </div>
  );
};

export default ProductCard;
export type { Product };