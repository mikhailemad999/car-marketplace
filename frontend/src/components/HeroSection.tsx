import React from 'react';
import { RealCarShowcase } from './RealCarShowcase';
import { Gauge, Zap, Flame, ArrowRight, Compass, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreInventory: () => void;
  onOpenTestDrive: () => void;
  onOpenAtelier: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onExploreInventory, onOpenTestDrive, onOpenAtelier }) => {
  return (
    <section id="showroom" style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
      {/* Background ambient red/orange glow */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '420px',
          background: 'radial-gradient(circle, rgba(225, 6, 0, 0.18) 0%, rgba(255, 85, 0, 0.08) 40%, rgba(0, 0, 0, 0) 70%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Hero Headline & Telemetry HUD */}
      <div className="container" style={{ position: 'relative', zIndex: 2, paddingTop: '36px', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <span className="badge-ferrari">LIMITED SPECIAL SERIES · 1 OF 799</span>
              <span style={{ color: '#FF5500', fontSize: '0.85rem', fontWeight: '700' }}>F1-DERIVED EXTRA BOOST</span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2.4rem, 4.8vw, 4.2rem)',
                fontWeight: '900',
                lineHeight: 1.05,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                maxWidth: '780px',
                marginBottom: '14px',
              }}
            >
              Ferrari SF90 <span style={{ color: '#E10600' }}>XX Stradale</span>
            </h1>

            <p style={{ fontSize: '1.05rem', color: '#B0B0C0', maxWidth: '640px', lineHeight: 1.6 }}>
              The first street-legal model in Ferrari’s prestigious XX Program history. Generating an astonishing 1,030 CV with a twin-profile fixed carbon rear wing producing 530 kg of downforce.
            </p>
          </div>

          {/* Real-time Telemetry Stats Pill Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '12px',
              background: 'rgba(18, 18, 24, 0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 85, 0, 0.25)',
              borderRadius: '16px',
              padding: '16px 20px',
              boxShadow: '0 8px 30px rgba(0,0,0,0.5), 0 0 15px rgba(255, 85, 0, 0.15)',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FF5500', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <Zap size={14} /> Total Power
              </div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                1,030 <span style={{ fontSize: '0.85rem', color: '#FF5500' }}>CV</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#FFD700', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <Gauge size={14} /> 0-100 km/h
              </div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                2.3 <span style={{ fontSize: '0.85rem', color: '#888' }}>SEC</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00D084', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <Flame size={14} /> Top Speed
              </div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                320 <span style={{ fontSize: '0.85rem', color: '#888' }}>KM/H</span>
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00B4D8', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
                <Compass size={14} /> Peak Downforce
              </div>
              <div className="mono" style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>
                530 <span style={{ fontSize: '0.85rem', color: '#888' }}>KG</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div style={{ display: 'flex', gap: '14px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button onClick={onExploreInventory} className="btn btn-primary" style={{ padding: '14px 28px' }}>
            Explore Full Fleet (18 Supercars)
            <ArrowRight size={18} />
          </button>
          <button onClick={onOpenTestDrive} className="btn btn-secondary" style={{ padding: '14px 24px' }}>
            Book Private Fiorano Test Drive
          </button>
          <button
            onClick={onOpenAtelier}
            className="btn btn-secondary"
            style={{ padding: '14px 24px', borderColor: 'rgba(255, 215, 0, 0.3)', color: '#FFD700' }}
          >
            <Sparkles size={16} />
            Tailor Made Atelier
          </button>
        </div>
      </div>

      {/* Official Ferrari Real Photographic Cinema Showcase */}
      <div style={{ marginTop: '20px', width: '100%', borderTop: '1px solid rgba(225, 6, 0, 0.25)', borderBottom: '1px solid rgba(225, 6, 0, 0.25)' }}>
        <RealCarShowcase />
      </div>
    </section>
  );
};
