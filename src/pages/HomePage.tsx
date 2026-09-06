import React, { useState } from 'react';
import {
  Zap,
  TrendingUp,
  Award,
  Star,
} from 'lucide-react';
import { useProducts } from '../context/ProductContext';
import { useLanguage } from '../context/LanguageContext';
import { ProductCard } from '../components/store/ProductCard';
import { QuickViewModal } from '../components/common/QuickViewModal';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products } = useProducts();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'trending' | 'featured' | 'deals'>('trending');
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const trendingProducts = products.filter(p => p.trending);
  const featuredProducts = products.filter(p => p.featured);
  const dealsProducts = products.slice(0, 4);

  const displayedProducts =
    activeTab === 'trending' ? trendingProducts :
    activeTab === 'featured' ? featuredProducts : dealsProducts;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem', paddingTop: '2rem', paddingBottom: '2.5rem' }}>
      {/* Featured & Trending Products Showcase */}
      <section className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '4px' }}>
            {t('forYou')}
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1.25rem' }}>{t('featuredProducts')}</h2>

          {/* Switcher Tabs */}
          <div
            style={{
              display: 'inline-flex',
              padding: '4px',
              backgroundColor: 'var(--bg-subtle)',
              borderRadius: 'var(--radius-full)',
              border: '1px solid var(--border-color)',
            }}
          >
            <button
              onClick={() => setActiveTab('trending')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'trending' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'trending' ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <TrendingUp size={16} /> {t('trending')}
            </button>
            <button
              onClick={() => setActiveTab('featured')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'featured' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'featured' ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Award size={16} /> {t('featured')}
            </button>
            <button
              onClick={() => setActiveTab('deals')}
              style={{
                padding: '8px 20px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor: activeTab === 'deals' ? 'var(--primary)' : 'transparent',
                color: activeTab === 'deals' ? 'white' : 'var(--text-muted)',
                fontWeight: 600,
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Zap size={16} /> Special Offers
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="store-products-grid">
          {displayedProducts.map((product) => (
            <ProductCard
              key={product.product_id}
              product={product}
              onQuickView={(p) => setQuickViewProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Customer Feedback
          </div>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Loved by Shoppers Across India</h2>
        </div>

        <div className="testimonials-grid">
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Ordered the Samsung Galaxy S25 Ultra on Friday and received it securely packed by Sunday morning. The AI features and display are phenomenal!"
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e0e7ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: 'var(--primary)' }}>
                AV
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Ananya Verma</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer • Bengaluru</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "The JAYVEER AI assistant helped me choose between HP Omen and Acer Nitro gaming laptops in seconds. Super smooth checkout experience."
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#d97706' }}>
                KP
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Karan Patel</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer • Ahmedabad</div>
              </div>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', color: '#f59e0b' }}>
              {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#f59e0b" />)}
            </div>
            <p style={{ fontSize: '0.9375rem', color: 'var(--text-main)', lineHeight: 1.6, fontStyle: 'italic' }}>
              "Exceptional customer service and live order timeline tracking. The furniture quality is top-notch solid wood. 10/10 recommendation!"
            </p>
            <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#d1fae5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#059669' }}>
                PS
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>Priya Sundaram</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Verified Buyer • Chennai</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};
