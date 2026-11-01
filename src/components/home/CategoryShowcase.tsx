import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';

interface CategoryTile {
  id: number;
  label: string;
  emoji: string;
  to: string;
  gradient: string;
  badge?: string;
  discountText?: string;
}

export const CategoryShowcase: React.FC = () => {
  const { t } = useLanguage();

  const categories: CategoryTile[] = [
    {
      id: 1,
      label: t('electronics'),
      emoji: '📱',
      to: '/store?cat=1',
      gradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
      badge: 'Popular',
      discountText: 'Up to 45% OFF',
    },
    {
      id: 2,
      label: t('ladiesWears'),
      emoji: '👗',
      to: '/store?cat=2',
      gradient: 'linear-gradient(135deg, #4a044e 0%, #86198f 100%)',
      badge: 'Trending',
      discountText: 'Flat 60% OFF',
    },
    {
      id: 3,
      label: t('mensWear'),
      emoji: '👔',
      to: '/store?cat=3',
      gradient: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
      discountText: 'From ₹799',
    },
    {
      id: 4,
      label: t('kidsWear'),
      emoji: '🧸',
      to: '/store?cat=4',
      gradient: 'linear-gradient(135deg, #78350f 0%, #d97706 100%)',
      discountText: 'Up to 50% OFF',
    },
    {
      id: 5,
      label: t('furnitures'),
      emoji: '🛋️',
      to: '/store?cat=5',
      gradient: 'linear-gradient(135deg, #022c22 0%, #065f46 100%)',
      badge: 'New',
      discountText: 'Save ₹18,000',
    },
    {
      id: 6,
      label: t('homeAppliances'),
      emoji: '📺',
      to: '/store?cat=6',
      gradient: 'linear-gradient(135deg, #1e3a5f 0%, #1d4ed8 100%)',
      discountText: 'Up to 35% OFF',
    },
    {
      id: 7,
      label: t('sports'),
      emoji: '⚽',
      to: '/store?cat=7',
      gradient: 'linear-gradient(135deg, #14532d 0%, #16a34a 100%)',
      discountText: 'Top Brands',
    },
    {
      id: 0,
      label: 'All Products',
      emoji: '🛍️',
      to: '/store',
      gradient: 'linear-gradient(135deg, #0f172a 0%, #334155 100%)',
      discountText: 'View All',
    },
  ];

  return (
    <section className="container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div
          style={{
            fontSize: '0.8125rem',
            fontWeight: 700,
            color: 'var(--primary)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}
        >
          Browse by Category
        </div>
        <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Shop What You Love</h2>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '1rem',
        }}
        className="category-showcase-grid"
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to={cat.to}
            style={{
              position: 'relative',
              background: cat.gradient,
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem 1.25rem',
              textDecoration: 'none',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              overflow: 'hidden',
              transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              minHeight: '130px',
              justifyContent: 'flex-end',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
            }}
          >
            {/* Subtle dot grid overlay */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                backgroundSize: '18px 18px',
                pointerEvents: 'none',
              }}
            />

            {/* Badge */}
            {cat.badge && (
              <span
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.625rem',
                  fontWeight: 700,
                  padding: '2px 8px',
                  borderRadius: '999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}
              >
                {cat.badge}
              </span>
            )}

            {/* Emoji */}
            <span style={{ fontSize: '2.5rem', lineHeight: 1, position: 'relative', zIndex: 1 }}>
              {cat.emoji}
            </span>

            {/* Label */}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', lineHeight: 1.2 }}>
                {cat.label}
              </div>
              {cat.discountText && (
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', marginTop: '2px' }}>
                  {cat.discountText}
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

