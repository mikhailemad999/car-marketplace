import React from 'react';
import { X, Check, Gauge, Zap, Flame, Compass, DollarSign } from 'lucide-react';
import { CarListing } from './SupercarInventory';

interface VehicleComparatorProps {
  cars: CarListing[];
  onRemove: (id: number) => void;
  onClose: () => void;
  onSelectCar: (car: CarListing) => void;
}

export const VehicleComparator: React.FC<VehicleComparatorProps> = ({ cars, onRemove, onClose, onSelectCar }) => {
  if (cars.length === 0) return null;

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 5, 8, 0.92)',
        backdropFilter: 'blur(16px)',
        zIndex: 220,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '1100px',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#0d0d12',
          border: '1px solid rgba(225, 6, 0, 0.5)',
          borderRadius: '20px',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'none',
            border: 'none',
            color: '#888',
            cursor: 'pointer',
          }}
        >
          <X size={22} />
        </button>

        <div style={{ marginBottom: '28px' }}>
          <span className="badge-ferrari">Telemetry Engine</span>
          <h2 style={{ fontSize: '2rem', fontWeight: '900', marginTop: '8px' }}>
            Side-by-Side Supercar Comparison
          </h2>
          <p style={{ color: '#888', fontSize: '0.9rem' }}>
            Compare powertrain metrics, downforce aerodynamics, and acquisition valuations.
          </p>
        </div>

        {/* Cars Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${cars.length}, 1fr)`,
            gap: '20px',
          }}
        >
          {cars.map((car) => {
            const mainImg = car.images && car.images[0] ? car.images[0].url : '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg';
            const hp = car.specs?.horsepower || 1000;
            const hpPercent = Math.min(100, (hp / 1100) * 100);

            return (
              <div
                key={car.id}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <button
                  onClick={() => onRemove(car.id)}
                  style={{
                    position: 'absolute',
                    top: '10px',
                    right: '10px',
                    background: 'rgba(0,0,0,0.6)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '26px',
                    height: '26px',
                    color: '#ff4d47',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                  title="Remove"
                >
                  <X size={14} />
                </button>

                <img
                  src={mainImg}
                  alt={car.title}
                  style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px', marginBottom: '14px' }}
                />

                <span style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: '700' }}>{car.year} · {car.color}</span>
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '8px' }}>
                  {car.title}
                </h3>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff', marginBottom: '16px' }}>
                  {formatPrice(car.price)}
                </div>

                {/* Comparative Spec Bars */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                  {/* Power Output */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: '#888' }}>Horsepower</span>
                      <span className="mono" style={{ fontWeight: '800', color: '#E10600' }}>{hp} CV</span>
                    </div>
                    <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${hpPercent}%`, height: '100%', background: '#E10600', borderRadius: '3px' }} />
                    </div>
                  </div>

                  {/* Acceleration 0-100 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: '#888' }}>0-100 km/h</span>
                      <span className="mono" style={{ fontWeight: '800', color: '#fff' }}>{car.specs?.acceleration || '2.5s'}</span>
                    </div>
                  </div>

                  {/* Top Speed */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: '4px' }}>
                      <span style={{ color: '#888' }}>Top Speed</span>
                      <span className="mono" style={{ fontWeight: '800', color: '#fff' }}>{car.specs?.topSpeed || '340 km/h'}</span>
                    </div>
                  </div>

                  {/* Engine Details */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' }}>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Engine Architecture</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ccc', marginTop: '2px' }}>
                      {car.specs?.engine || '4.0L V8'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>Transmission & Drivetrain</div>
                    <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#ccc', marginTop: '2px' }}>
                      {car.specs?.transmission || '8-Speed F1 DCT'} · {car.specs?.drivetrain || 'e-4WD'}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    onClose();
                    onSelectCar(car);
                  }}
                  className="btn btn-primary"
                  style={{ marginTop: 'auto', padding: '10px', fontSize: '0.85rem' }}
                >
                  Inspect Supercar
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
