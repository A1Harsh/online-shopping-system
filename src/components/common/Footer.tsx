import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Truck, RefreshCw, Headphones } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { useLanguage } from '../../context/LanguageContext';

export const Footer: React.FC = () => {
  const { categories } = useProducts();
  const { t, translateCategory } = useLanguage();

  return (
    <footer style={{ backgroundColor: '#0f172a', color: '#cbd5e1', borderTop: '1px solid #1e293b', marginTop: '4rem' }}>
      {/* Value Proposition Bar */}
      <div style={{ borderBottom: '1px solid #1e293b', padding: '2.5rem 0' }}>
        <div className="container">
          <div className="grid grid-cols-4 gap-6">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(79, 70, 229, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                <Truck size={24} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>{t('freeExpressDelivery')}</h4>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{t('deliverySub')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#34d399' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>{t('genuineGuarantee')}</h4>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{t('genuineSub')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fbbf24' }}>
                <RefreshCw size={24} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>{t('sevenDayReturns')}</h4>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{t('returnsSub')}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(14, 165, 233, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                <Headphones size={24} />
              </div>
              <div>
                <h4 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600 }}>{t('support247')}</h4>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>{t('supportSub')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container" style={{ padding: '3.5rem 1.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem' }}>
          {/* Brand Info */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '1rem' }}>
              <img
                src={`${import.meta.env.BASE_URL}jayveermart-logo.png`}
                alt="JAYVEERMart"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  objectFit: 'cover',
                  boxShadow: '0 3px 10px rgba(0, 0, 0, 0.3)',
                }}
              />
              <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'white', fontFamily: 'var(--font-heading)' }}>
                JAYVEER<span style={{ color: '#818cf8' }}>Mart</span>
              </span>
            </Link>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1.25rem' }}>
              JAYVEERMart Enterprise is a modern e-commerce platform delivering curated electronics, apparel, furniture, and appliances with high speed and unmatched reliability.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8125rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Phone size={14} color="#818cf8" /> +91 1800 123 4567
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Mail size={14} color="#818cf8" /> support@jayveermart.com
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MapPin size={14} color="#818cf8" /> JAYVEER Tech Park, Sector 5, Bengaluru
              </div>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {t('shopByCategories')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              {categories.slice(0, 7).map((cat) => (
                <li key={cat.cat_id}>
                  <Link
                    to={`/store?cat=${cat.cat_id}`}
                    style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'white')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {translateCategory(cat.cat_title)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Self-Service */}
          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>
              {t('customerCare')}
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
              <li>
                <Link to="/my-orders" style={{ color: '#94a3b8' }}>{t('trackOrder')}</Link>
              </li>
              <li>
                <Link to="/my-profile" style={{ color: '#94a3b8' }}>{t('myProfile')}</Link>
              </li>
              <li>
                <Link to="/cart" style={{ color: '#94a3b8' }}>{t('shoppingCart')}</Link>
              </li>
              <li>
                <Link to="/wishlist" style={{ color: '#94a3b8' }}>{t('wishlist')}</Link>
              </li>
              <li>
                <Link to="/conditions-of-use" style={{ color: '#94a3b8' }}>{t('termsOfUse')}</Link>
              </li>
              <li>
                <Link to="/privacy-notice" style={{ color: '#94a3b8' }}>{t('privacyNotice')}</Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div>
            <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Stay Updated
            </h3>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1rem', lineHeight: 1.5 }}>
              Subscribe to get exclusive flash discount coupons and early access to product launches.
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert('Thank you for subscribing! Check your inbox for your 15% discount coupon.');
              }}
              style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
            >
              <input
                type="email"
                required
                placeholder="Enter your email address"
                style={{
                  padding: '8px 12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  color: 'white',
                  fontSize: '0.875rem',
                  outline: 'none',
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '8px' }}>
                Subscribe Now
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Copyright & Badges */}
        <div
          style={{
            marginTop: '3rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid #1e293b',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            fontSize: '0.8125rem',
            color: '#64748b',
          }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <span>© {new Date().getFullYear()} JAYVEERMart Enterprise. {t('allRightsReserved')}</span>
            <span style={{ color: '#334155' }}>|</span>
            <Link to="/conditions-of-use" style={{ color: '#94a3b8', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              {t('termsOfUse')}
            </Link>
            <span style={{ color: '#334155' }}>|</span>
            <Link to="/privacy-notice" style={{ color: '#94a3b8', textDecoration: 'none' }} onMouseEnter={(e) => e.currentTarget.style.color = '#818cf8'} onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}>
              {t('privacyNotice')}
            </Link>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <span style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#94a3b8', fontWeight: 600 }}>COD Available</span>
            <span style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#94a3b8', fontWeight: 600 }}>UPI / Cards</span>
            <span style={{ backgroundColor: '#1e293b', padding: '4px 8px', borderRadius: '4px', color: '#94a3b8', fontWeight: 600 }}>100% Secure SSL</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
