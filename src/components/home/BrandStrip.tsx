import React from 'react';
import { Link } from 'react-router-dom';

interface BrandItem {
  name: string;
  emoji: string;
  to: string;
}

export const BrandStrip: React.FC = () => {
  const brands: BrandItem[] = [
    { name: 'Samsung', emoji: '🔵', to: '/store?brand=2' },
    { name: 'HP', emoji: '🔷', to: '/store?brand=1' },
    { name: 'Apple', emoji: '🍎', to: '/store?brand=3' },
    { name: 'Motorola', emoji: '📡', to: '/store?brand=4' },
    { name: 'LG', emoji: '🟥', to: '/store?brand=5' },
    { name: 'Nike', emoji: '✔️', to: '/store?cat=7' },
    { name: 'Puma', emoji: '🐾', to: '/store?cat=7' },
    { name: 'Adidas', emoji: '🏃', to: '/store?cat=7' },
  ];

  return (
    <section
      style={{
        backgroundColor: 'white',
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        padding: '1.25rem 0',
        overflow: 'hidden',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
            }}
          >
            Top Brands
          </span>
          <div style={{ flex: 1, height: '1px', background: 'var(--border-light)' }} />
        </div>

        <div
          style={{
            display: 'flex',
            gap: '1rem',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            paddingBottom: '4px',
          }}
        >
          {brands.map((brand) => (
            <Link
              key={brand.name}
              to={brand.to}
              title={`Shop ${brand.name}`}
              style={{
                flexShrink: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '8px 20px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-color)',
                textDecoration: 'none',
                color: 'var(--text-main)',
                fontWeight: 700,
                fontSize: '0.875rem',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--primary-light)';
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.color = 'var(--primary)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--bg-subtle)';
                e.currentTarget.style.borderColor = 'var(--border-color)';
                e.currentTarget.style.color = 'var(--text-main)';
              }}
            >
              <span style={{ fontSize: '1rem' }}>{brand.emoji}</span>
              {brand.name}
            </Link>
          ))}
          <Link
            to="/store"
            style={{
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 20px',
              backgroundColor: 'var(--primary)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--primary)',
              textDecoration: 'none',
              color: 'white',
              fontWeight: 700,
              fontSize: '0.875rem',
              whiteSpace: 'nowrap',
            }}
          >
            All Brands &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
};

