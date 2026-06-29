import { useState, useEffect } from 'react';
import BalanceIcon from '@mui/icons-material/Balance';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
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
  const [isFavorite, setIsFavorite] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [isCompared, setIsCompared] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('compare');
    const list: number[] = stored ? JSON.parse(stored) : [];
    setIsCompared(list.includes(product.id));
  }, [product.id]);

  useEffect(() => {
    const handleCompareUpdate = () => {
      const stored = localStorage.getItem('compare');
      const list: number[] = stored ? JSON.parse(stored) : [];
      setIsCompared(list.includes(product.id));
    };
    window.addEventListener('compareUpdated', handleCompareUpdate);
    return () => window.removeEventListener('compareUpdated', handleCompareUpdate);
  }, [product.id]);

  const handleFavoriteClick = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Потрібно увійти в акаунт');
      return;
    }

    setFavLoading(true);

    try {
      if (isFavorite) {
        await fetch(`http://localhost:8000/api/favorites/${product.id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setIsFavorite(false);
      } else {
        const res = await fetch('http://localhost:8000/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });

        if (res.ok) {
          setIsFavorite(true);
        } else {
          const err = await res.json();
          if (res.status !== 400) {
            alert(err.detail || 'Помилка');
          }
        }
      }
    } catch (err: any) {
      alert(err.message || 'Помилка сервера');
    } finally {
      setFavLoading(false);
    }
  };

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
  };const handleCompareClick = () => {
    const stored = localStorage.getItem('compare');
    let compareList: number[] = stored ? JSON.parse(stored) : [];

    if (compareList.includes(product.id)) {
      compareList = compareList.filter(id => id !== product.id);
      setIsCompared(false);
    } else {
      if (compareList.length >= 4) {
        alert('Можно сравнивать не более 4 товаров');
        return;
      }
      compareList.push(product.id);
      setIsCompared(true);
    }

    localStorage.setItem('compare', JSON.stringify(compareList));
    window.dispatchEvent(new Event('compareUpdated'));
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
            <button
              className="product-action-btn"
              onClick={handleCompareClick}
              style={{
                borderColor: isCompared ? '#5b35e5' : undefined,
                color: isCompared ? '#4c35e5' : undefined
              }}
            >
              <BalanceIcon fontSize="small" />
            </button>
            <button
              className="product-action-btn fav"
              onClick={handleFavoriteClick}
              disabled={favLoading}
              style={{ color: isFavorite ? '#e53935' : undefined, borderColor: isFavorite ? '#e53935' : undefined }}
            >
              {isFavorite ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
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