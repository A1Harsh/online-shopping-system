import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CreditCard,
  Truck,
  QrCode,
  Building2,
  ShieldCheck,
  Lock,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Tag,
  Check,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useOrders } from '../context/OrderContext';
import { formatCurrency, getProductImageUrl } from '../utils/formatters';

export const CheckoutPage: React.FC = () => {
  const { cartItems, subtotal, tax, shipping, total, discountAmount, couponCode, clearCart } = useCart();
  const { user } = useAuth();
  const { placeOrder } = useOrders();
  const navigate = useNavigate();

  // Form State
  const [fullName, setFullName] = useState(user ? `${user.first_name} ${user.last_name}`.trim() : '');
  const [email, setEmail] = useState(user ? user.email : '');
  const [mobile, setMobile] = useState(user ? user.mobile : '');
  const [address, setAddress] = useState(user ? user.address1 : '');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'Card' | 'UPI' | 'NetBanking'>('Card');
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (cartItems.length === 0) {
    return (
      <div className="container" style={{ padding: '6rem 1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>No Items in Cart to Checkout</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Please add items to your cart before proceeding to checkout.
        </p>
        <Link to="/store" className="btn btn-primary">
          Browse Store
        </Link>
      </div>
    );
  }

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !address.trim() || !city.trim() || !zip.trim()) {
      setErrorMessage('Please fill in all required shipping address fields.');
      return;
    }

    if (zip.trim().length !== 6 || !/^\d{6}$/.test(zip.trim())) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const orderItems = cartItems.map((item) => ({
        product_id: item.product.product_id,
        qty: item.qty,
      }));

      // Mask card number strictly without storing CVV or full PAN
      const maskedCard =
        paymentMethod === 'Card'
          ? `•••• •••• •••• ${cardNumber.replace(/\s+/g, '').slice(-4) || 'XXXX'}`
          : undefined;

      const newOrder = await placeOrder({
        user_id: user ? user.user_id : 0, // 0 signifies guest checkout with email association
        f_name: fullName.trim(),
        email: email.trim(),
        address: address.trim(),
        city: city.trim(),
        state: state.trim(),
        zip: zip.trim(),
        payment_method: paymentMethod,
        cardname: paymentMethod === 'Card' ? cardName.trim() : undefined,
        cardnumber: maskedCard,
        coupon_code: couponCode || undefined,
        items: orderItems,
      });

      // Launch Celebratory Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (err) {
        console.log('Confetti triggered');
      }

      clearCart();
      navigate(`/order-success/${newOrder.order_id}`);
    } catch (err: any) {
      setErrorMessage(err?.message || 'An error occurred while creating your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.5rem 5rem' }}>
      {/* Checkout Header & Security Assurance */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Secure Checkout</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Complete your delivery details and choose your preferred payment option
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 14px', backgroundColor: '#ecfdf5', borderRadius: 'var(--radius-full)', color: '#059669', fontSize: '0.8125rem', fontWeight: 700 }}>
          <ShieldCheck size={18} /> 256-Bit SSL Encrypted & Verified
        </div>
      </div>

      {/* Checkout Progress Stepper */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2.5rem',
          padding: '1rem 1.5rem',
          backgroundColor: 'white',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 800 }}>
            1
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Delivery Details</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Shipping address</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: paymentMethod ? 'var(--primary)' : 'var(--bg-subtle)', color: paymentMethod ? 'white' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 800 }}>
            2
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Payment Method</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Card, UPI, NetBanking, COD</div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'var(--bg-subtle)', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8125rem', fontWeight: 800 }}>
            3
          </div>
          <div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700 }}>Order Confirmation</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Instant receipt & tracking</div>
          </div>
        </div>
      </div>

      {errorMessage && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--danger-light)',
            color: 'var(--danger)',
            borderRadius: 'var(--radius-md)',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={18} /> {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmitOrder}>
        <div className="checkout-layout-grid">
          {/* Left Column: Address & Payment */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {/* Step 1: Shipping Address */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  1
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Shipping & Delivery Details</h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Full Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Full Name"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field"
                    placeholder="your@email.com"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="input-field"
                    placeholder="+91 XXXXX XXXXX"
                  />
                </div>

                <div className="input-group" style={{ gridColumn: 'span 2' }}>
                  <label className="input-label">Delivery Street Address *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="input-field"
                    placeholder="House/Flat No., Building name, Street, Area"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="input-field"
                    placeholder="Your City"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">State *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="input-field"
                    placeholder="e.g. Maharashtra / Karnataka"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">PIN / Postal Code (6 Digits) *</label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={zip}
                    onChange={(e) => setZip(e.target.value.replace(/\D/g, ''))}
                    className="input-field"
                    placeholder="PIN Code"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Payment Method */}
            <div className="card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                  2
                </div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>Select Payment Method</h2>
              </div>

              {/* Payment Method Selector Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                <div
                  onClick={() => setPaymentMethod('Card')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'Card' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === 'Card' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <CreditCard size={24} color={paymentMethod === 'Card' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Credit / Debit Card</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Visa, Mastercard, RuPay</span>
                </div>

                <div
                  onClick={() => setPaymentMethod('UPI')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'UPI' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === 'UPI' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <QrCode size={24} color={paymentMethod === 'UPI' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Instant UPI / QR</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>GPay, PhonePe, Paytm</span>
                </div>

                <div
                  onClick={() => setPaymentMethod('NetBanking')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'NetBanking' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === 'NetBanking' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Building2 size={24} color={paymentMethod === 'NetBanking' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Net Banking</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>All major banks</span>
                </div>

                <div
                  onClick={() => setPaymentMethod('COD')}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    border: paymentMethod === 'COD' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                    backgroundColor: paymentMethod === 'COD' ? 'var(--primary-light)' : 'white',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    textAlign: 'center',
                    transition: 'all 0.2s',
                  }}
                >
                  <Truck size={24} color={paymentMethod === 'COD' ? 'var(--primary)' : 'var(--text-muted)'} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Cash on Delivery</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pay at doorstep</span>
                </div>
              </div>

              {/* Card Inputs */}
              {paymentMethod === 'Card' && (
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">Name on Card</label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="input-field"
                        placeholder="Name as printed on card"
                      />
                    </div>

                    <div className="input-group" style={{ gridColumn: 'span 2' }}>
                      <label className="input-label">Card Number</label>
                      <input
                        type="text"
                        required
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="input-field"
                        placeholder="•••• •••• •••• ••••"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Expiry Date</label>
                      <input
                        type="text"
                        required
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        className="input-field"
                        placeholder="MM/YY"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">CVV Code</label>
                      <input
                        type="password"
                        required
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="input-field"
                        placeholder="•••"
                      />
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldCheck size={14} color="var(--primary)" /> Card details are tokenized in compliance with PCI-DSS & RBI standards. We never store CVV.
                  </div>
                </div>
              )}

              {/* UPI QR Display */}
              {paymentMethod === 'UPI' && (
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
                  <div style={{ width: '120px', height: '120px', backgroundColor: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <QrCode size={90} color="var(--primary)" />
                  </div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '4px' }}>Scan with Any UPI App</h4>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                    UPI ID: <strong>store@upi</strong> • GPay / PhonePe / Paytm accepted
                  </p>
                </div>
              )}

              {/* NetBanking Notice */}
              {paymentMethod === 'NetBanking' && (
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Building2 size={24} color="var(--primary)" />
                  <div style={{ fontSize: '0.875rem' }}>
                    <strong>Direct Bank Payment:</strong> You will be securely redirected to your bank's official portal to authorize payment.
                  </div>
                </div>
              )}

              {/* COD Notice */}
              {paymentMethod === 'COD' && (
                <div style={{ backgroundColor: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={24} color="var(--success)" />
                  <div style={{ fontSize: '0.875rem' }}>
                    <strong>Cash on Delivery selected:</strong> Pay securely using cash or UPI at the time of delivery with zero additional handling charges.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary & Place Order */}
          <div className="card" style={{ padding: '2rem', position: 'sticky', top: '90px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1.5rem' }}>Order Review</h3>

            {/* Items Mini List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '240px', overflowY: 'auto', marginBottom: '1.5rem', paddingRight: '4px' }}>
              {cartItems.map((item) => (
                <div key={item.id} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <img
                    src={getProductImageUrl(item.product.product_image)}
                    alt={item.product.product_title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60';
                    }}
                    style={{ width: '45px', height: '45px', objectFit: 'contain', borderRadius: '6px', background: '#f8fafc', padding: '2px' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8125rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {item.product.product_title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Qty: {item.qty} × {formatCurrency(item.product.product_price)}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>
                    {formatCurrency(item.product.product_price * item.qty)}
                  </div>
                </div>
              ))}
            </div>

            {/* Price Calculations */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Subtotal</span>
                <span>{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)', fontWeight: 600 }}>
                  <span>Promo Discount ({couponCode})</span>
                  <span>-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>GST (5%)</span>
                <span>{formatCurrency(tax)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)' }}>
                <span>Shipping</span>
                <span>{shipping === 0 ? <strong style={{ color: 'var(--success)' }}>FREE</strong> : formatCurrency(shipping)}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: 'var(--text-main)',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed var(--border-color)',
                  marginTop: '4px',
                  fontFamily: 'var(--font-heading)',
                }}
              >
                <span>Total Due</span>
                <span style={{ color: 'var(--primary)' }}>{formatCurrency(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem', fontWeight: 700 }}
            >
              {isSubmitting ? (
                'Processing Order...'
              ) : (
                <>
                  <Lock size={18} /> Place Order ({formatCurrency(total)})
                </>
              )}
            </button>

            {/* Trust & Compliance Strip */}
            <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: '#059669', fontWeight: 600 }}>
                <ShieldCheck size={16} /> 256-Bit Bank Grade SSL Encrypted Checkout
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Lock size={14} /> PCI-DSS Level 1 & RBI Secure Gateway
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                <Check size={14} color="#10b981" /> 7-Day Money Back & Replacement Guarantee
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
