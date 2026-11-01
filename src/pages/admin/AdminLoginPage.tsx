import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Eye, EyeOff, AlertCircle, Info } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const isDev = import.meta.env.DEV;

export const AdminLoginPage: React.FC = () => {
  const { adminLogin, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // If already authenticated, redirect to admin
  useEffect(() => {
    if (isAdmin) navigate(from, { replace: true });
  }, [isAdmin, navigate, from]);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((s) => {
        if (s <= 1) { clearInterval(timer); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || lockoutSeconds > 0) return;

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const result = await adminLogin(email.trim(), password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setError(result.message);
        // Extract lockout seconds from message if present
        const match = result.message.match(/(\d+) second/);
        if (match) setLockoutSeconds(parseInt(match[1], 10));
      }
    } catch {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '1.5rem',
      fontFamily: "var(--font-body, -apple-system, 'Segoe UI', sans-serif)",
    }}>
      {/* Background decoration */}
      <div style={{
        position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none',
      }}>
        <div style={{
          position: 'absolute', top: '-20%', left: '-10%',
          width: '500px', height: '500px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%)',
        }} />
        <div style={{
          position: 'absolute', bottom: '-20%', right: '-10%',
          width: '600px', height: '600px', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.1) 0%, transparent 70%)',
        }} />
      </div>

      <div style={{ width: '100%', maxWidth: '420px', position: 'relative', zIndex: 1 }}>
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: '64px', height: '64px', borderRadius: '18px',
            background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
            boxShadow: '0 8px 32px rgba(79,70,229,0.4)',
            marginBottom: '1rem',
          }}>
            <ShieldCheck size={32} color="white" />
          </div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 900, color: '#ffffff', margin: 0, letterSpacing: '-0.03em' }}>
            JAYVEER<span style={{ color: '#818cf8' }}>Admin</span>
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.4rem' }}>
            Secure Control Center — Sign in to continue
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(99,102,241,0.2)',
          borderRadius: '20px',
          padding: '2rem',
          boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
        }}>
          {/* Dev credentials hint */}
          {isDev && (
            <div style={{
              background: 'rgba(99,102,241,0.1)',
              border: '1px solid rgba(99,102,241,0.3)',
              borderRadius: '10px',
              padding: '0.75rem 1rem',
              marginBottom: '1.5rem',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start',
            }}>
              <Info size={16} color="#818cf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div style={{ fontSize: '0.8rem', color: '#a5b4fc', lineHeight: 1.5 }}>
                <strong>Dev mode</strong> — Default credentials:<br />
                📧 <code style={{ color: '#c7d2fe' }}>admin@jayveermart.com</code><br />
                🔑 <code style={{ color: '#c7d2fe' }}>Admin@1234</code>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} color="#4f46e5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@jayveermart.com"
                  autoComplete="email"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.75rem',
                    background: 'rgba(30,41,59,0.8)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.2)'}`,
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; }}
                  onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.2)'; }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.5rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} color="#4f46e5" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: '100%',
                    padding: '0.75rem 2.75rem 0.75rem 2.75rem',
                    background: 'rgba(30,41,59,0.8)',
                    border: `1px solid ${error ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.2)'}`,
                    borderRadius: '10px',
                    color: '#f1f5f9',
                    fontSize: '0.9rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#4f46e5'; }}
                  onBlur={(e) => { e.target.style.borderColor = error ? 'rgba(239,68,68,0.5)' : 'rgba(99,102,241,0.2)'; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  style={{
                    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#64748b',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div style={{
                display: 'flex', alignItems: 'flex-start', gap: '8px',
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
              }}>
                <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: '1px' }} />
                <span style={{ fontSize: '0.8125rem', color: '#fca5a5', lineHeight: 1.5 }}>{error}</span>
              </div>
            )}

            {/* Lockout countdown */}
            {lockoutSeconds > 0 && (
              <div style={{
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: '10px', padding: '0.75rem 1rem', marginBottom: '1.25rem',
                textAlign: 'center', fontSize: '0.8125rem', color: '#fbbf24',
              }}>
                🔒 Account locked — retry in <strong>{lockoutSeconds}s</strong>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || lockoutSeconds > 0}
              style={{
                width: '100%',
                padding: '0.875rem',
                background: isLoading || lockoutSeconds > 0
                  ? 'rgba(79,70,229,0.4)'
                  : 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '0.9375rem',
                fontWeight: 700,
                cursor: isLoading || lockoutSeconds > 0 ? 'not-allowed' : 'pointer',
                boxShadow: isLoading || lockoutSeconds > 0 ? 'none' : '0 4px 16px rgba(79,70,229,0.4)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {isLoading ? (
                <>
                  <div style={{
                    width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white', borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite',
                  }} />
                  Authenticating...
                </>
              ) : lockoutSeconds > 0 ? (
                `Locked — ${lockoutSeconds}s`
              ) : (
                <>
                  <ShieldCheck size={18} />
                  Sign In to Admin Panel
                </>
              )}
            </button>
          </form>

          {/* Back to store */}
          <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
            <a href="/" style={{ fontSize: '0.8125rem', color: '#64748b', textDecoration: 'none' }}>
              ← Back to Storefront
            </a>
          </div>
        </div>

        {/* Footer */}
        <p style={{ textAlign: 'center', color: '#334155', fontSize: '0.75rem', marginTop: '1.5rem' }}>
          JAYVEERMart Enterprise Admin · Protected Access
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #475569; }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;
