import React from 'react';
import { Shield, User as UserIcon, PlusCircle, LayoutDashboard, LogOut, KeyRound, Sparkles, Calculator, Scale } from 'lucide-react';

interface NavbarProps {
  currentUser: any;
  comparedCount: number;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenSeller: () => void;
  onOpenAdmin: () => void;
  onOpenAtelier: () => void;
  onOpenFinance: () => void;
  onOpenCompare: () => void;
  onScrollToSection: (id: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  comparedCount,
  onOpenAuth,
  onLogout,
  onOpenSeller,
  onOpenAdmin,
  onOpenAtelier,
  onOpenFinance,
  onOpenCompare,
  onScrollToSection,
}) => {
  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(10, 10, 12, 0.88)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Italian Flag Tricolor Top Stripe */}
      <div style={{ height: '3px', width: '100%', display: 'flex' }}>
        <div style={{ flex: 1, background: '#009246' }} />
        <div style={{ flex: 1, background: '#FFFFFF' }} />
        <div style={{ flex: 1, background: '#CE2B37' }} />
      </div>

      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '74px' }}>
        {/* Scuderia Ferrari Brand */}
        <div
          onClick={() => onScrollToSection('hero')}
          style={{ display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}
        >
          <div
            style={{
              width: '42px',
              height: '42px',
              background: '#E10600',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #FFD700',
              boxShadow: '0 0 16px rgba(225, 6, 0, 0.5)',
              transform: 'rotate(-3deg)',
            }}
          >
            <span style={{ color: '#FFD700', fontWeight: '900', fontSize: '1.2rem', fontStyle: 'italic' }}>SF</span>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '0.05em', color: '#FFF' }}>
                SCUDERIA SF90
              </span>
              <span className="badge-ferrari" style={{ fontSize: '0.68rem', padding: '2px 8px' }}>XX STRADALE</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#8E8E9F', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              Maranello Certified Supercars (18 Models)
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <button
            onClick={() => onScrollToSection('showroom')}
            style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
          >
            XX Gallery
          </button>
          <button
            onClick={() => onScrollToSection('inventory')}
            style={{ background: 'none', border: 'none', color: '#FFF', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer' }}
          >
            Fleet (18)
          </button>
          <button
            onClick={onOpenAtelier}
            style={{ background: 'none', border: 'none', color: '#FFD700', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Sparkles size={14} />
            Tailor Made
          </button>
          <button
            onClick={onOpenFinance}
            style={{ background: 'none', border: 'none', color: '#00D084', fontSize: '0.88rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
          >
            <Calculator size={14} />
            Leasing
          </button>
          {comparedCount > 0 && (
            <button
              onClick={onOpenCompare}
              style={{ background: 'rgba(225,6,0,0.15)', border: '1px solid #E10600', borderRadius: '20px', padding: '4px 12px', color: '#FF3833', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <Scale size={14} />
              Compare ({comparedCount})
            </button>
          )}
        </nav>

        {/* User Action Area */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {currentUser ? (
            <>
              {(currentUser.role === 'seller' || currentUser.role === 'admin') && (
                <button
                  onClick={onOpenSeller}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  <PlusCircle size={16} color="#00D084" />
                  Seller Portal
                </button>
              )}

              {currentUser.role === 'admin' && (
                <button
                  onClick={onOpenAdmin}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem', borderColor: 'rgba(255, 215, 0, 0.4)' }}
                >
                  <LayoutDashboard size={16} color="#FFD700" />
                  Admin HQ
                </button>
              )}

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: currentUser.role === 'admin' ? '#FFD700' : currentUser.role === 'seller' ? '#00D084' : '#E10600',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: currentUser.role === 'admin' ? '#000' : '#fff',
                    fontSize: '0.75rem',
                    fontWeight: '800',
                  }}
                >
                  {currentUser.name.charAt(0)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: '700', color: '#fff' }}>{currentUser.name}</span>
                  <span style={{ fontSize: '0.65rem', textTransform: 'uppercase', color: '#888', fontWeight: '600' }}>
                    {currentUser.role}
                  </span>
                </div>
                <button
                  onClick={onLogout}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: '4px' }}
                  title="Sign Out"
                >
                  <LogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <button onClick={onOpenAuth} className="btn btn-primary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
              <KeyRound size={16} />
              Sign In / Switch Role
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
