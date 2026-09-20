import React, { useState } from 'react';
import { X, Sparkles, Check, Palette, Award } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TailorMadeAtelierModalProps {
  onClose: () => void;
}

export const TailorMadeAtelierModal: React.FC<TailorMadeAtelierModalProps> = ({ onClose }) => {
  const [interiorColor, setInteriorColor] = useState('Rosso Ferrari');
  const [caliperColor, setCaliperColor] = useState('Rosso Corsa');
  const [carbonPack, setCarbonPack] = useState(true);
  const [cockpitAlcantara, setCockpitAlcantara] = useState(true);
  const [saved, setSaved] = useState(false);

  const INTERIORS = [
    { name: 'Rosso Ferrari', hex: '#A81C1C', desc: 'Full Poltrona Frau leather with tonal stitching' },
    { name: 'Cuoio Naturale', hex: '#B87A44', desc: 'Classic Tuscan tan leather with contrast black seams' },
    { name: 'Nero Alcantara', hex: '#1C1C21', desc: 'Technical lightweight racing suede with orange accents' },
    { name: 'Grigio Scuro', hex: '#525459', desc: 'Monochromatic slate leather with carbon seat shells' },
  ];

  const CALIPERS = [
    { name: 'Rosso Corsa', hex: '#D40000' },
    { name: 'Giallo Modena', hex: '#FDD017' },
    { name: 'Alluminio', hex: '#C0C4CC' },
    { name: 'Nero Lucido', hex: '#111115' },
  ];

  const handleSaveAtelierSpec = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#FFD700', '#E10600'],
    });
    setSaved(true);
    setTimeout(() => {
      onClose();
    }, 1800);
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
          maxWidth: '720px',
          background: '#0d0d12',
          border: '1px solid rgba(255, 215, 0, 0.4)',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(255, 215, 0, 0.15)',
              border: '1px solid #FFD700',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFD700',
            }}
          >
            <Sparkles size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>Ferrari Tailor Made Atelier</h2>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              Bespoke personalization program developed in Maranello
            </div>
          </div>
        </div>

        {saved ? (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <Award size={56} color="#FFD700" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Atelier Specification Saved!</h3>
            <p style={{ color: '#aaa', marginTop: '8px' }}>
              Your personalized configuration has been recorded under Ferrari client profile.
            </p>
          </div>
        ) : (
          <div>
            {/* Interior Leather Selection */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', fontWeight: '700', marginBottom: '10px' }}>
                1. Poltrona Frau Leather & Alcantara Interior
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '12px' }}>
                {INTERIORS.map((item) => {
                  const isSelected = interiorColor === item.name;
                  return (
                    <div
                      key={item.name}
                      onClick={() => setInteriorColor(item.name)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        background: isSelected ? 'rgba(225, 6, 0, 0.15)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '1px solid #E10600' : '1px solid rgba(255,255,255,0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: item.hex, border: '2px solid rgba(255,255,255,0.2)', flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: '700', fontSize: '0.9rem', color: '#fff' }}>{item.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#888' }}>{item.desc}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Brake Caliper Color */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#aaa', fontWeight: '700', marginBottom: '10px' }}>
                2. Brembo Carbon-Ceramic Brake Caliper Livery
              </label>
              <div style={{ display: 'flex', gap: '12px' }}>
                {CALIPERS.map((cal) => {
                  const isSelected = caliperColor === cal.name;
                  return (
                    <button
                      key={cal.name}
                      onClick={() => setCaliperColor(cal.name)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: isSelected ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
                        border: isSelected ? '2px solid #fff' : '1px solid rgba(255,255,255,0.1)',
                        cursor: 'pointer',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: cal.hex }} />
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#fff' }}>{cal.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Options Checkboxes */}
            <div style={{ display: 'flex', gap: '16px', marginBottom: '28px' }}>
              <label
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <input
                  type="checkbox"
                  checked={carbonPack}
                  onChange={(e) => setCarbonPack(e.target.checked)}
                  style={{ accentColor: '#E10600' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Assetto Fiorano Carbon Pack</div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>Diffusers, splitter, and engine louvers</div>
                </div>
              </label>

              <label
                style={{
                  flex: 1,
                  padding: '14px',
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <input
                  type="checkbox"
                  checked={cockpitAlcantara}
                  onChange={(e) => setCockpitAlcantara(e.target.checked)}
                  style={{ accentColor: '#E10600' }}
                />
                <div>
                  <div style={{ fontWeight: '700', fontSize: '0.85rem' }}>Racing Carbon Bucket Seats</div>
                  <div style={{ fontSize: '0.72rem', color: '#888' }}>Mono-shell with 4-point racing harness</div>
                </div>
              </label>
            </div>

            <button onClick={handleSaveAtelierSpec} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
              Commit Bespoke Atelier Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
