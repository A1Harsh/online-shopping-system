import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Sparkles,
  Zap,
  ShieldCheck,
  Truck,
  CreditCard,
  Flame,
  Award,
  Clock,
  Laptop,
  ShoppingBag,
  Tag,
  Star,
} from 'lucide-react';
import { getProductImageUrl } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

interface BannerSlide {
  id: string;
  badgeText: string;
  badgeIcon: React.ReactNode;
  badgeBg: string;
  badgeColor: string;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  secondaryCtaIcon?: React.ReactNode;
  themeGradient: string;
  accentColor: string;
  glowColor1: string;
  glowColor2: string;
  chips: { icon: React.ReactNode; label: string }[];
  mainImage: string;
  mainImageAlt: string;
  floatingBadges: {
    title: string;
    subtitle?: string;
    position: 'top-right' | 'bottom-left' | 'top-left' | 'bottom-right';
    bg: string;
    color: string;
    icon?: React.ReactNode;
  }[];
  showCountdown?: boolean;
}

export const HeroBannerSlider: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 48, seconds: 26 });
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  // Live Countdown Timer for Deal Urgency
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const slides: BannerSlide[] = [
    {
      id: 'electronics-fest',
      badgeText: '🔥 MEGA ELECTRONICS FESTIVAL • FLAT UP TO 45% OFF',
      badgeIcon: <Flame size={14} color="#f97316" />,
      badgeBg: 'rgba(249, 115, 22, 0.18)',
      badgeColor: '#fdba74',
      title: 'Next-Gen Flagships & Galaxy AI Pro Tech',
      subtitle:
        'Experience the revolutionary Samsung Galaxy S25 Ultra, HP Pavilion 15.6, and high-performance computing with instant bank rebates and No-Cost EMI.',
      primaryCtaText: 'Explore Electronics',
      primaryCtaLink: '/store?cat=1',
      secondaryCtaText: 'View S25 Ultra',
      secondaryCtaLink: '/product/5',
      secondaryCtaIcon: <Laptop size={16} />,
      themeGradient: 'linear-gradient(135deg, #090d16 0%, #1e1b4b 45%, #0f172a 100%)',
      accentColor: '#38bdf8',
      glowColor1: 'rgba(56, 189, 248, 0.35)',
      glowColor2: 'rgba(99, 102, 241, 0.4)',
      chips: [
        { icon: <Zap size={14} color="#38bdf8" />, label: '⚡ Same-Day Express Dispatch' },
        { icon: <CreditCard size={14} color="#fbbf24" />, label: '💳 No Cost EMI from ₹4,999/mo' },
        { icon: <ShieldCheck size={14} color="#34d399" />, label: '🛡️ 1-Yr Official Brand Warranty' },
      ],
      mainImage: 'product_images/1772203299_1770809937_samsung-galaxy-s25-ultra-front-and-back-2.png',
      mainImageAlt: 'Samsung Galaxy S25 Ultra with S-Pen',
      floatingBadges: [
        {
          title: 'HOT LAUNCH',
          subtitle: 'Galaxy AI Enabled',
          position: 'top-right',
          bg: '#f59e0b',
          color: '#0f172a',
          icon: <Sparkles size={13} />,
        },
        {
          title: '⭐ 4.9 Top Rated',
          subtitle: '28+ Verified Reviews',
          position: 'bottom-left',
          bg: 'rgba(15, 23, 42, 0.9)',
          color: '#ffffff',
          icon: <Star size={13} fill="#fbbf24" color="#fbbf24" />,
        },
      ],
    },
    {
      id: 'fashion-carnival',
      badgeText: '👗 JAYVEER FASHION FIESTA • FLAT 40% TO 70% OFF',
      badgeIcon: <Sparkles size={14} color="#f43f5e" />,
      badgeBg: 'rgba(244, 63, 94, 0.2)',
      badgeColor: '#fda4af',
      title: 'Trending Ethnic & Designer Glamour',
      subtitle:
        'Dazzling red bridal georgette gowns, premium fleece hoodies & chic couture. Handpicked fabrics tailored for modern luxury and supreme comfort.',
      primaryCtaText: 'Shop Fashion Sale',
      primaryCtaLink: '/store?cat=2',
      secondaryCtaText: "Men's Streetwear",
      secondaryCtaLink: '/store?cat=3',
      secondaryCtaIcon: <ShoppingBag size={16} />,
      themeGradient: 'linear-gradient(135deg, #2a0845 0%, #581c87 45%, #831843 100%)',
      accentColor: '#f43f5e',
      glowColor1: 'rgba(244, 63, 94, 0.4)',
      glowColor2: 'rgba(168, 85, 247, 0.35)',
      chips: [
        { icon: <Award size={14} color="#f43f5e" />, label: '✨ 100% Pure Georgette & Combed Cotton' },
        { icon: <Truck size={14} color="#38bdf8" />, label: '🔄 Free 7-Day Easy Size Exchange' },
        { icon: <Tag size={14} color="#fbbf24" />, label: '🏷️ Extra 20% OFF with Code SUPER20' },
      ],
      mainImage: 'product_images/Red Designer Ladies Dress.png',
      mainImageAlt: 'Red Designer Ladies Dress',
      floatingBadges: [
        {
          title: 'NEW ARRIVAL',
          subtitle: 'Festive Collection',
          position: 'top-right',
          bg: '#ec4899',
          color: '#ffffff',
          icon: <Sparkles size={13} />,
        },
        {
          title: 'Flat 60% OFF',
          subtitle: 'Starting ₹1,499',
          position: 'bottom-left',
          bg: 'rgba(255, 255, 255, 0.95)',
          color: '#831843',
          icon: <Tag size={13} />,
        },
      ],
    },
    {
      id: 'home-makeover',
      badgeText: '🛋️ LUXURY LIVING DAYS • SAVE UP TO ₹18,000',
      badgeIcon: <Award size={14} color="#34d399" />,
      badgeBg: 'rgba(16, 185, 129, 0.2)',
      badgeColor: '#6ee7b7',
      title: 'Solid Sheesham Wood & Smart Living',
      subtitle:
        'Transform your home into an upscale sanctuary with handcrafted solid walnut furniture, plush living room sets, and energy-efficient appliances.',
      primaryCtaText: 'Explore Furnitures',
      primaryCtaLink: '/store?cat=5',
      secondaryCtaText: 'Home Appliances',
      secondaryCtaLink: '/store?cat=6',
      themeGradient: 'linear-gradient(135deg, #022c22 0%, #064e3b 50%, #0f172a 100%)',
      accentColor: '#34d399',
      glowColor1: 'rgba(16, 185, 129, 0.35)',
      glowColor2: 'rgba(45, 212, 191, 0.3)',
      chips: [
        { icon: <ShieldCheck size={14} color="#34d399" />, label: '🪵 100% Solid Seasoned Wood' },
        { icon: <Truck size={14} color="#38bdf8" />, label: '🚚 Free White-Glove Home Assembly' },
        { icon: <Award size={14} color="#fbbf24" />, label: '🛡️ 5-Year Termite Proof Warranty' },
      ],
      mainImage: 'product_images/Modern Living Furniture Set.jpeg',
      mainImageAlt: 'Modern Living Furniture Set',
      floatingBadges: [
        {
          title: 'BESTSELLER',
          subtitle: 'Handcrafted Walnut',
          position: 'top-right',
          bg: '#10b981',
          color: '#ffffff',
          icon: <Award size={13} />,
        },
        {
          title: 'Free Delivery',
          subtitle: 'Pre-assembled & Polished',
          position: 'bottom-left',
          bg: 'rgba(15, 23, 42, 0.95)',
          color: '#34d399',
          icon: <Truck size={13} />,
        },
      ],
    },
    {
      id: 'flash-savings',
      badgeText: '⚡ LIMITED TIME DEAL • USE CODE: SUPER20',
      badgeIcon: <Clock size={14} color="#eab308" />,
      badgeBg: 'rgba(234, 179, 8, 0.2)',
      badgeColor: '#fde047',
      title: 'Flat 20% Instant Savings Storewide',
      subtitle:
        'Shop from our extensive catalog of authentic electronics, apparel, and home essentials. Instant discount auto-applied on orders above ₹1,000.',
      primaryCtaText: 'Claim 20% Discount',
      primaryCtaLink: '/store',
      secondaryCtaText: 'Trending Deals',
      secondaryCtaLink: '/store?sort=rating',
      themeGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #7c2d12 100%)',
      accentColor: '#f59e0b',
      glowColor1: 'rgba(245, 158, 11, 0.35)',
      glowColor2: 'rgba(99, 102, 241, 0.4)',
      showCountdown: true,
      chips: [
        { icon: <Tag size={14} color="#fbbf24" />, label: '🎟️ Code SUPER20 Applied Automatically' },
        { icon: <CreditCard size={14} color="#38bdf8" />, label: '💳 10% Extra on HDFC & ICICI Cards' },
        { icon: <Truck size={14} color="#34d399" />, label: '🚀 Free Express Shipping across India' },
      ],
      mainImage: 'product_images/1772203498_1770813172_motorola-g85-5g-pdp-ecom-render-6-gadget-gray-z2wh5m54a.png',
      mainImageAlt: 'Trending Flash Deal Smartphones',
      floatingBadges: [
        {
          title: 'FLASH SALE',
          subtitle: 'Ends Tonight',
          position: 'top-right',
          bg: '#ef4444',
          color: '#ffffff',
          icon: <Flame size={13} />,
        },
        {
          title: 'Extra 20% OFF',
          subtitle: 'Auto-applied',
          position: 'bottom-left',
          bg: 'rgba(255, 255, 255, 0.95)',
          color: '#1e1b4b',
          icon: <Tag size={13} />,
        },
      ],
    },
  ];

  // Auto slide transition (5.5s)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  // Touch Swipe Handling for Mobile Devices
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 50) {
      nextSlide();
    } else if (diff < -50) {
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const active = slides[currentSlide];

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Banner Slide Container */}
      <section
        style={{
          background: active.themeGradient,
          color: 'white',
          position: 'relative',
          overflow: 'hidden',
          transition: 'background 0.6s ease-in-out',
          minHeight: '450px',
          display: 'flex',
          alignItems: 'center',
          padding: '3.5rem 0 4rem',
        }}
      >
        {/* Dynamic Ambient Glow Flares */}
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-80px',
            width: '450px',
            height: '450px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${active.glowColor1} 0%, rgba(0,0,0,0) 70%)`,
            filter: 'blur(55px)',
            transition: 'all 0.8s ease',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-90px',
            left: '-90px',
            width: '420px',
            height: '420px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${active.glowColor2} 0%, rgba(0,0,0,0) 70%)`,
            filter: 'blur(55px)',
            transition: 'all 0.8s ease',
            pointerEvents: 'none',
          }}
        />

        {/* Subtle Geometric Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            pointerEvents: 'none',
          }}
        />

        <div className="container" style={{ position: 'relative', zIndex: 3, width: '100%' }}>
          <div
            className="hero-slider-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1.2fr 0.8fr',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Content Column */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              {/* Event Badge */}
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: active.badgeBg,
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  fontSize: '0.78125rem',
                  fontWeight: 700,
                  color: active.badgeColor,
                  marginBottom: '1rem',
                  letterSpacing: '0.04em',
                }}
              >
                {active.badgeIcon}
                <span>{active.badgeText}</span>
              </div>

              {/* Main Headline */}
              <h1
                style={{
                  fontSize: 'clamp(1.85rem, 4.5vw, 3.25rem)',
                  fontWeight: 900,
                  color: 'white',
                  lineHeight: 1.16,
                  marginBottom: '0.85rem',
                  fontFamily: 'var(--font-heading)',
                  letterSpacing: '-0.02em',
                }}
              >
                {active.title}
              </h1>

              {/* Subtitle */}
              <p
                style={{
                  fontSize: 'clamp(0.875rem, 2vw, 1.05rem)',
                  color: '#cbd5e1',
                  lineHeight: 1.6,
                  marginBottom: '1.5rem',
                  maxWidth: '560px',
                }}
              >
                {active.subtitle}
              </p>

              {/* Live Countdown Urgency Timer (For Flash Slide) */}
              {active.showCountdown && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    backgroundColor: 'rgba(0, 0, 0, 0.35)',
                    backdropFilter: 'blur(10px)',
                    padding: '8px 16px',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    marginBottom: '1.5rem',
                  }}
                >
                  <Clock size={16} color="#fbbf24" />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#fef08a' }}>
                    Deals End In:
                  </span>
                  <div style={{ display: 'flex', gap: '6px', fontWeight: 800, fontFamily: 'var(--font-heading)' }}>
                    <span style={{ background: '#f59e0b', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {String(timeLeft.hours).padStart(2, '0')}h
                    </span>
                    <span>:</span>
                    <span style={{ background: '#f59e0b', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {String(timeLeft.minutes).padStart(2, '0')}m
                    </span>
                    <span>:</span>
                    <span style={{ background: '#f59e0b', color: '#0f172a', padding: '2px 8px', borderRadius: '4px', fontSize: '0.875rem' }}>
                      {String(timeLeft.seconds).padStart(2, '0')}s
                    </span>
                  </div>
                </div>
              )}

              {/* Feature Chips */}
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                  marginBottom: '1.75rem',
                }}
              >
                {active.chips.map((chip, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      padding: '4px 10px',
                      borderRadius: 'var(--radius-full)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      fontSize: '0.75rem',
                      color: '#e2e8f0',
                      fontWeight: 500,
                    }}
                  >
                    {chip.icon}
                    <span>{chip.label}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', alignItems: 'center' }}>
                <Link
                  to={active.primaryCtaLink}
                  className="btn btn-primary btn-lg"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    padding: '0.75rem 1.85rem',
                    fontSize: '0.95rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 20px rgba(79, 70, 229, 0.45)',
                  }}
                >
                  {active.primaryCtaText} <ArrowRight size={18} />
                </Link>

                <Link
                  to={active.secondaryCtaLink}
                  className="btn btn-outline btn-lg"
                  style={{
                    borderRadius: 'var(--radius-full)',
                    color: 'white',
                    borderColor: 'rgba(255, 255, 255, 0.35)',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    padding: '0.75rem 1.6rem',
                    fontSize: '0.95rem',
                    fontWeight: 600,
                  }}
                >
                  {active.secondaryCtaIcon}
                  <span>{active.secondaryCtaText}</span>
                </Link>
              </div>
            </div>

            {/* Right Product Showcase Graphic */}
            <div
              className="hero-slider-graphic-col"
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div
                className="hero-slider-card glass-panel"
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '430px',
                  padding: '1.75rem',
                  background: 'rgba(255, 255, 255, 0.09)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  borderColor: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '28px',
                  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.55)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                {/* Product Image Stage */}
                <div
                  style={{
                    width: '100%',
                    height: '280px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background:
                      'radial-gradient(circle, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.02) 80%)',
                    borderRadius: 'var(--radius-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={getProductImageUrl(active.mainImage)}
                    alt={active.mainImageAlt}
                    style={{
                      maxHeight: '235px',
                      maxWidth: '88%',
                      objectFit: 'contain',
                      filter: 'drop-shadow(0 15px 25px rgba(0,0,0,0.45))',
                      transition: 'transform 0.4s ease',
                    }}
                  />

                  {/* Floating Promotional Badges */}
                  {active.floatingBadges.map((badge, idx) => {
                    const isTopRight = badge.position === 'top-right';
                    const isBottomLeft = badge.position === 'bottom-left';
                    return (
                      <div
                        key={idx}
                        style={{
                          position: 'absolute',
                          top: isTopRight ? '14px' : 'auto',
                          bottom: isBottomLeft ? '14px' : 'auto',
                          right: isTopRight ? '14px' : 'auto',
                          left: isBottomLeft ? '14px' : 'auto',
                          backgroundColor: badge.bg,
                          color: badge.color,
                          padding: '6px 12px',
                          borderRadius: 'var(--radius-md)',
                          boxShadow: '0 6px 16px rgba(0, 0, 0, 0.35)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          zIndex: 5,
                        }}
                      >
                        {badge.icon}
                        <div style={{ lineHeight: 1.2 }}>
                          <div style={{ fontSize: '0.78125rem', fontWeight: 800 }}>{badge.title}</div>
                          {badge.subtitle && (
                            <div style={{ fontSize: '0.6875rem', opacity: 0.9, fontWeight: 500 }}>
                              {badge.subtitle}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Card Quick Shop Bar */}
                <div
                  style={{
                    width: '100%',
                    marginTop: '1.25rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: 'white' }}>
                      {active.mainImageAlt}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                      Official JAYVEERMart Guarantee
                    </div>
                  </div>

                  <Link
                    to={active.secondaryCtaLink}
                    className="btn btn-primary btn-sm"
                    style={{
                      borderRadius: 'var(--radius-full)',
                      padding: '0.45rem 1.1rem',
                      fontSize: '0.8125rem',
                      fontWeight: 700,
                    }}
                  >
                    View <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Previous / Next Arrow Controls */}
        <button
          onClick={prevSlide}
          title="Previous Offer"
          aria-label="Previous Offer"
          style={{
            position: 'absolute',
            left: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <ChevronLeft size={22} />
        </button>

        <button
          onClick={nextSlide}
          title="Next Offer"
          aria-label="Next Offer"
          style={{
            position: 'absolute',
            right: '18px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10,
            background: 'rgba(15, 23, 42, 0.55)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            color: 'white',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.3)',
          }}
        >
          <ChevronRight size={22} />
        </button>

        {/* Bottom Slide Indicator Tabs */}
        <div
          style={{
            position: 'absolute',
            bottom: '14px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            zIndex: 10,
          }}
        >
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              title={`Go to slide ${index + 1}`}
              aria-label={`Go to slide ${index + 1}`}
              style={{
                width: currentSlide === index ? '32px' : '10px',
                height: '10px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                backgroundColor:
                  currentSlide === index ? 'white' : 'rgba(255, 255, 255, 0.35)',
                cursor: 'pointer',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* Sub-Hero Trust Strip (Flipkart & Amazon India Style) */}
      <div
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-color)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)',
        }}
      >
        <div className="container">
          <div
            className="hero-trust-bar"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '1rem',
              padding: '1rem 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--primary-light)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--primary)',
                  flexShrink: 0,
                }}
              >
                <Truck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Free Express Delivery</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>On orders above ₹1,000</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#ecfdf5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  flexShrink: 0,
                }}
              >
                <ShieldCheck size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>100% Genuine Products</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Direct from authorized brands</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#fffbeb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  flexShrink: 0,
                }}
              >
                <CreditCard size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Instant Bank Discounts</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Up to 10% on HDFC & ICICI</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#f5f3ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#8b5cf6',
                  flexShrink: 0,
                }}
              >
                <Award size={20} />
              </div>
              <div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>7-Day Easy Returns</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Instant refund or exchange</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
