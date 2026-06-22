import { useState } from 'react';
import BalanceIcon from '@mui/icons-material/Balance';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import './ProductCard.css';

interface Product {
  id: number;
  name: string;
  price: number;
  image_url?: string;
  sizes?: string[];
  product_type?: string;
  rating?: number;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const sizes = product.sizes || [];
  const [showDescription, setShowDescription] = useState(false);

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Потрібно увійти в акаунт');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          quantity: 1,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail || 'Помилка');
      }

      alert(`Товар "${product.name}" додано до кошика`);
      window.dispatchEvent(new Event('cartUpdated'));
    } catch (err: any) {
      alert(err.message || 'Помилка сервера');
    }
  };

  return (
    <>
      <div className="product-card">
        <div className="product-image-wrap">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="product-image" />
          ) : (
            <div className="product-image-placeholder"></div>
          )}

          {/* ⭐ Рейтинг слева сверху */}
          {product.rating != null && (
            <div style={{
              position: 'absolute',
              top: '8px',
              left: '8px',
              background: 'rgba(0,0,0,0.7)',
              color: '#f5c518',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              zIndex: 2
            }}>
              ⭐ {Number(product.rating).toFixed(1)}
            </div>
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

          {/* Кнопка описания */}
          {product.description && (
            <button
              onClick={() => setShowDescription(true)}
              style={{
                display: 'block',
                margin: '6px auto 0 auto',
                background: 'none',
                border: '1px solid #ddd',
                padding: '6px 16px',
                cursor: 'pointer',
                fontSize: '12px',
                color: '#888',
                borderRadius: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#f5c518';
                e.currentTarget.style.borderColor = '#f5c518';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#888';
                e.currentTarget.style.borderColor = '#ddd';
              }}
            >
              Опис товару
            </button>
          )}
        </div>
      </div>

      {/* Модальное окно описания */}
      {showDescription && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.75)',
            zIndex: 3000,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px'
          }}
          onClick={() => setShowDescription(false)}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '8px',
              padding: '30px',
              maxWidth: '500px',
              width: '100%',
              maxHeight: '80vh',
              overflowY: 'auto',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowDescription(false)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '16px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#888'
              }}
            >
              ×
            </button>
            <h3 style={{ fontFamily: 'Oswald, sans-serif', marginBottom: '16px' }}>{product.name}</h3>
            <p style={{ color: '#555', lineHeight: 1.6 }}>{product.description}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default ProductCard;
export type { Product };