import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { SupercarInventory, CarListing } from './components/SupercarInventory';
import { CarDetailModal } from './components/CarDetailModal';
import { SellerModal } from './components/SellerModal';
import { AdminModal } from './components/AdminModal';
import { AuthModal } from './components/AuthModal';
import { VehicleComparator } from './components/VehicleComparator';
import { FinanceCalculatorModal } from './components/FinanceCalculatorModal';
import { TailorMadeAtelierModal } from './components/TailorMadeAtelierModal';
import { Zap, Cpu, Gauge, Wind, ShieldCheck, Database, CheckCircle2, ChevronRight, Scale, Calculator, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [selectedCar, setSelectedCar] = useState<CarListing | null>(null);
  const [comparedCars, setComparedCars] = useState<CarListing[]>([]);

  // Modals state
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSellerOpen, setIsSellerOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFinanceOpen, setIsFinanceOpen] = useState(false);
  const [financeSelectedCar, setFinanceSelectedCar] = useState<CarListing | null>(null);
  const [isAtelierOpen, setIsAtelierOpen] = useState(false);
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const [inventoryRefreshKey, setInventoryRefreshKey] = useState(0);

  useEffect(() => {
    const savedToken = localStorage.getItem('ferrari_token');
    const savedUser = localStorage.getItem('ferrari_user');
    if (savedToken && savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        // Fallback
      }
    } else {
      setCurrentUser({
        id: 3,
        name: 'Alex Vance',
        email: 'buyer@client.com',
        role: 'buyer',
      });
      localStorage.setItem('ferrari_token', 'demo-token');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ferrari_token');
    localStorage.removeItem('ferrari_user');
    setCurrentUser(null);
  };

  const handleToggleCompare = (car: CarListing) => {
    setComparedCars((prev) => {
      const exists = prev.some((c) => c.id === car.id);
      if (exists) {
        return prev.filter((c) => c.id !== car.id);
      } else {
        if (prev.length >= 3) {
          alert('You can compare up to 3 supercars simultaneously.');
          return prev;
        }
        return [...prev, car];
      }
    });
  };

  const handleOpenFinanceForCar = (car?: CarListing) => {
    setFinanceSelectedCar(car || null);
    setIsFinanceOpen(true);
  };

  const scrollToSection = (id: string) => {
    const elem = document.getElementById(id);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0A0A0C', color: '#FFF' }}>
      {/* Navigation Bar */}
      <Navbar
        currentUser={currentUser}
        comparedCount={comparedCars.length}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenSeller={() => setIsSellerOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenAtelier={() => setIsAtelierOpen(true)}
        onOpenFinance={() => handleOpenFinanceForCar()}
        onOpenCompare={() => setIsCompareOpen(true)}
        onScrollToSection={scrollToSection}
      />

      {/* Hero & 3D SF90 XX Stradale Showcase & Gallery */}
      <HeroSection
        onExploreInventory={() => scrollToSection('inventory')}
        onOpenTestDrive={() => {
          fetch('http://localhost:4000/listings')
            .then((r) => r.json())
            .then((data) => {
              if (data && data.data && data.data[0]) {
                setSelectedCar(data.data[0]);
              }
            })
            .catch(() => scrollToSection('inventory'));
        }}
        onOpenAtelier={() => setIsAtelierOpen(true)}
      />

      {/* Full Fleet Inventory (18 Supercars) with Comparison & Leasing */}
      <SupercarInventory
        onSelectCar={(car) => setSelectedCar(car)}
        onOpenFinance={handleOpenFinanceForCar}
        onOpenCompare={() => setIsCompareOpen(true)}
        comparedCars={comparedCars}
        onToggleCompare={handleToggleCompare}
        refreshTrigger={inventoryRefreshKey}
      />

      {/* Engineering Showcase Section */}
      <section
        id="engineering"
        style={{
          padding: '100px 0',
          background: 'linear-gradient(180deg, #0A0A0C 0%, #101015 100%)',
          borderTop: '1px solid rgba(255,255,255,0.06)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          position: 'relative',
        }}
      >
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 60px' }}>
            <span className="badge-ferrari" style={{ marginBottom: '10px' }}>XX PROGRAMME AERODYNAMICS</span>
            <h2 style={{ fontSize: '2.8rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Formula 1 Engineering For The <span style={{ color: '#E10600' }}>Road</span>
            </h2>
            <p style={{ color: '#8E8E9F', marginTop: '12px', fontSize: '1.05rem', lineHeight: 1.6 }}>
              The Ferrari SF90 XX Stradale represents the apex of Maranello track technology transferred into a road-legal masterpiece.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '24px',
            }}
          >
            {/* Pillar 1 */}
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                border: '1px solid rgba(255, 85, 0, 0.3)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 85, 0, 0.15)',
                  border: '1px solid #FF5500',
                  color: '#FF5500',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Cpu size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '10px' }}>
                1,030 CV with Extra Boost Logic
              </h3>
              <p style={{ color: '#A0A0B0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                The 4.0L twin-turbo V8 produces 797 CV alone, complemented by three electric motors producing 233 CV. A patented Extra Boost function delivers a burst of additional electric power on corner exit.
              </p>
            </div>

            {/* Pillar 2 */}
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                border: '1px solid rgba(225, 6, 0, 0.3)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(225, 6, 0, 0.15)',
                  border: '1px solid #E10600',
                  color: '#E10600',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Wind size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '10px' }}>
                530 kg Fixed Wing Downforce
              </h3>
              <p style={{ color: '#A0A0B0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                The first street-legal Ferrari with a fixed rear wing since the F50. Synchronized with the mobile shut-off Gurney flap, the system creates 530 kg of aerodynamic downforce at 250 km/h.
              </p>
            </div>

            {/* Pillar 3 */}
            <div
              className="glass-panel"
              style={{
                padding: '32px',
                border: '1px solid rgba(0, 208, 132, 0.3)',
                transition: 'transform 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-6px)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(0, 208, 132, 0.15)',
                  border: '1px solid #00D084',
                  color: '#00D084',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '20px',
                }}
              >
                <Gauge size={24} />
              </div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '800', marginBottom: '10px' }}>
                Triple Front Fender Louvers
              </h3>
              <p style={{ color: '#A0A0B0', fontSize: '0.9rem', lineHeight: 1.6 }}>
                Three longitudinal cooling gills carved directly into the carbon front fenders vent turbulent wheel well pressure, ensuring surgical front-end steering bite at triple-digit speeds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#070709', padding: '60px 0 30px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '30px', marginBottom: '40px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    background: '#E10600',
                    borderRadius: '6px',
                    color: '#FFD700',
                    fontWeight: '900',
                    fontStyle: 'italic',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1rem',
                  }}
                >
                  SF
                </div>
                <span style={{ fontSize: '1.2rem', fontWeight: '900', letterSpacing: '0.05em' }}>
                  SCUDERIA SF90 XX STRADALE
                </span>
              </div>
              <p style={{ color: '#777', maxWidth: '420px', fontSize: '0.85rem', lineHeight: 1.5 }}>
                Official Ferrari Supercar Marketplace & 3D Interactive Configurator powered by NestJS, TypeORM, and MySQL database engine on port 3305 with password 1234.
              </p>
            </div>

            {/* Database & Infrastructure Status Pill */}
            <div
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00D084', fontSize: '0.8rem', fontWeight: '700' }}>
                <CheckCircle2 size={16} />
                <span>MySQL 5.7 Active (Port 3305) · 18 Supercars</span>
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: '#888' }}>
                DB: supercar_marketplace · Auth: JWT RBAC · 3D: WebGL Three.js PBR
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.06)',
              paddingTop: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: '#666',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>© 2026 Scuderia Ferrari Supercar Marketplace Platform. Certified by Senior Architecture Standards.</div>
            <div style={{ display: 'flex', gap: '20px' }}>
              <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
              <span style={{ cursor: 'pointer' }}>Terms of Acquisition</span>
              <span style={{ cursor: 'pointer' }}>Security Standards</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom Comparison Drawer if items selected */}
      {comparedCars.length > 0 && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 15, 20, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(225, 6, 0, 0.6)',
            borderRadius: '9999px',
            padding: '10px 24px',
            boxShadow: '0 12px 40px rgba(0,0,0,0.8), 0 0 20px rgba(225,6,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            zIndex: 150,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={18} color="#FF3833" />
            <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>
              {comparedCars.length} Supercar{comparedCars.length > 1 ? 's' : ''} Selected
            </span>
          </div>

          <button
            onClick={() => setIsCompareOpen(true)}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '0.85rem' }}
          >
            Launch Comparison
          </button>

          <button
            onClick={() => setComparedCars([])}
            style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '0.8rem' }}
          >
            Clear
          </button>
        </div>
      )}

      {/* Modals */}
      {selectedCar && (
        <CarDetailModal
          car={selectedCar}
          currentUser={currentUser}
          onClose={() => setSelectedCar(null)}
          onRequireAuth={() => {
            setSelectedCar(null);
            setIsAuthOpen(true);
          }}
          onPaymentSuccess={() => {
            setInventoryRefreshKey((prev) => prev + 1);
          }}
        />
      )}

      {isSellerOpen && (
        <SellerModal
          onClose={() => setIsSellerOpen(false)}
          onListingCreated={() => {
            setInventoryRefreshKey((prev) => prev + 1);
          }}
        />
      )}

      {isAdminOpen && <AdminModal onClose={() => setIsAdminOpen(false)} />}

      {isAuthOpen && (
        <AuthModal
          onClose={() => setIsAuthOpen(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
          }}
        />
      )}

      {isFinanceOpen && (
        <FinanceCalculatorModal
          car={financeSelectedCar}
          onClose={() => {
            setIsFinanceOpen(false);
            setFinanceSelectedCar(null);
          }}
        />
      )}

      {isAtelierOpen && (
        <TailorMadeAtelierModal
          onClose={() => setIsAtelierOpen(false)}
        />
      )}

      {isCompareOpen && (
        <VehicleComparator
          cars={comparedCars}
          onRemove={(id) => setComparedCars((prev) => prev.filter((c) => c.id !== id))}
          onClose={() => setIsCompareOpen(false)}
          onSelectCar={(car) => {
            setIsCompareOpen(false);
            setSelectedCar(car);
          }}
        />
      )}
    </div>
  );
};

export default App;
