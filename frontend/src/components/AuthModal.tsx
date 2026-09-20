import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Shield, ArrowRight } from 'lucide-react';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<'buyer' | 'seller' | 'admin'>('buyer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (overrideEmail?: string, overridePassword?: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: overrideEmail || email,
          password: overridePassword || password,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('ferrari_token', data.accessToken);
      localStorage.setItem('ferrari_user', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.accessToken);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:4000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phone || '+1 (415) 555-0199',
          role,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      localStorage.setItem('ferrari_token', data.accessToken);
      localStorage.setItem('ferrari_user', JSON.stringify(data.user));
      onLoginSuccess(data.user, data.accessToken);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '480px',
          background: '#0d0d12',
          border: '1px solid rgba(225, 6, 0, 0.4)',
          borderRadius: '20px',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}
        >
          <X size={20} />
        </button>

        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: '#E10600',
              color: '#FFD700',
              fontWeight: '900',
              fontStyle: 'italic',
              fontSize: '1.4rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
              boxShadow: '0 0 20px rgba(225, 6, 0, 0.5)',
            }}
          >
            SF
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: '#fff' }}>
            Scuderia Ferrari Access
          </h2>
          <p style={{ color: '#888', fontSize: '0.85rem' }}>
            Role-Based Authentication (Buyer · Seller · Admin)
          </p>
        </div>

        {/* Quick Demo Switcher */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '14px', marginBottom: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase', marginBottom: '8px', fontWeight: '700' }}>
            ⚡ Instant One-Click Login
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            <button
              onClick={() => handleLogin('admin@scuderia.com', 'admin123')}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: '#FFD700',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Admin HQ
            </button>
            <button
              onClick={() => handleLogin('seller@maranello.com', 'seller123')}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                background: 'rgba(0, 208, 132, 0.1)',
                border: '1px solid rgba(0, 208, 132, 0.3)',
                color: '#00D084',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Seller
            </button>
            <button
              onClick={() => handleLogin('buyer@client.com', 'buyer123')}
              style={{
                padding: '8px 4px',
                borderRadius: '8px',
                background: 'rgba(225, 6, 0, 0.1)',
                border: '1px solid rgba(225, 6, 0, 0.3)',
                color: '#FF3833',
                fontSize: '0.75rem',
                fontWeight: '700',
                cursor: 'pointer',
              }}
            >
              Buyer Client
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '4px', marginBottom: '20px' }}>
          <button
            onClick={() => setTab('login')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'login' ? '#E10600' : 'transparent',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => setTab('register')}
            style={{
              flex: 1,
              padding: '8px',
              borderRadius: '6px',
              border: 'none',
              background: tab === 'register' ? '#E10600' : 'transparent',
              color: '#fff',
              fontWeight: '700',
              fontSize: '0.85rem',
              cursor: 'pointer',
            }}
          >
            Register
          </button>
        </div>

        {error && (
          <div
            style={{
              padding: '10px 14px',
              borderRadius: '8px',
              background: 'rgba(225, 6, 0, 0.15)',
              border: '1px solid #E10600',
              color: '#FF4A45',
              fontSize: '0.85rem',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        {tab === 'login' ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
          >
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                required
                placeholder="client@scuderia.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '6px' }}>Full Name</label>
              <input
                type="text"
                required
                placeholder="Enzo Ferrari"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '6px' }}>Email</label>
              <input
                type="email"
                required
                placeholder="enzo@maranello.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#00D084', marginBottom: '6px', fontWeight: '700' }}>
                Phone Contact (Direct Routing)
              </label>
              <input
                type="tel"
                placeholder="+1 (415) 555-0199 or +39 0536 949111"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(0, 208, 132, 0.4)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '6px' }}>Password</label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  outline: 'none',
                }}
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.8rem', color: '#aaa', marginBottom: '6px' }}>Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as any)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'rgba(255,255,255,0.08)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: '8px',
                  outline: 'none',
                }}
              >
                <option value="buyer">Buyer (Browse & Place Escrow Reservations)</option>
                <option value="seller">Seller (Publish & Manage Supercar Inventory)</option>
                <option value="admin">Administrator (Platform Audit & Analytics)</option>
              </select>
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '12px' }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
