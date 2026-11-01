import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 300);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      aria-label="Scroll to top"
      title="Back to top"
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        zIndex: 8000,
        width: '44px',
        height: '44px',
        borderRadius: '50%',
        background: 'linear-gradient(135deg, var(--primary) 0%, #6366f1 100%)',
        color: 'white',
        border: 'none',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 4px 15px rgba(79, 70, 229, 0.45)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        animation: 'fadeIn 0.25s ease forwards',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px) scale(1.08)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(79, 70, 229, 0.55)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = '0 4px 15px rgba(79, 70, 229, 0.45)';
      }}
    >
      <ArrowUp size={20} />
    </button>
  );
};

