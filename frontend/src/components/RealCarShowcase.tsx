import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Compass,
  Zap,
  Flame,
  Info,
  Layers,
  Sparkles,
  Sliders,
  CheckCircle2,
} from 'lucide-react';

export interface PhotoShot {
  id: string;
  src: string;
  title: string;
  subtitle: string;
  category: 'Track Action' | 'Aerodynamics' | 'Cockpit' | 'Details' | 'Rear Section';
  location: string;
  telemetry: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    description: string;
  };
  hotspots?: Array<{
    x: number; // percentage
    y: number; // percentage
    title: string;
    spec: string;
  }>;
}

const SF90_XX_PHOTOS: PhotoShot[] = [
  {
    id: 'shot-1',
    src: '/cars/2024-ferrari-sf90xx-137-6552496a38c7b.jpg',
    title: 'Fiorano Apex Cornering',
    subtitle: 'High-G Lateral Load & Active Aerodynamics',
    category: 'Track Action',
    location: 'Pista di Fiorano · Curva Grande',
    telemetry: {
      label1: 'Lateral G-Force',
      val1: '1.45 G',
      label2: 'Active Downforce',
      val2: '530 kg @ 250 km/h',
      description: 'The fixed twin-profile rear wing works in concert with the active shut-off Gurney flap to maximize downforce across Fiorano apexes.',
    },
    hotspots: [
      { x: 62, y: 44, title: 'Twin-Profile Carbon Wing', spec: 'Produces 530 kg peak downforce with dual endplates' },
      { x: 30, y: 78, title: 'Front Fender Louvers', spec: 'Triple carbon gills extract wheel arch pressure' },
      { x: 44, y: 72, title: 'Assetto Fiorano Livery', spec: 'Rosso Corsa with Flash Orange aerodynamic accents' },
    ],
  },
  {
    id: 'shot-2',
    src: '/cars/2024-ferrari-sf90xx-134-6552496c82eea.jpg',
    title: 'High-Speed Straight Acceleration',
    subtitle: '1,030 CV Combined F1 Hybrid Power',
    category: 'Track Action',
    location: 'Pista di Fiorano · Main Straight',
    telemetry: {
      label1: '0-100 km/h',
      val1: '2.3 sec',
      label2: 'Top Speed',
      val2: '320 km/h',
      description: 'Under full acceleration, three electric motors combine with the 797 CV twin-turbo V8 to unleash Extra Boost power delivery.',
    },
    hotspots: [
      { x: 50, y: 45, title: 'Low-Drag Cockpit', spec: 'Bubble teardrop carbon roof channel' },
      { x: 74, y: 65, title: 'Rear Underbody Venturi', spec: 'Carbon diffusers create massive ground-effect suction' },
    ],
  },
  {
    id: 'shot-3',
    src: '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg',
    title: 'Aggressive Front Three-Quarter Stance',
    subtitle: 'Maranello Sculpted Aerodynamic Architecture',
    category: 'Aerodynamics',
    location: 'Ferrari Design Centre · Maranello',
    telemetry: {
      label1: 'Front Axle Grip',
      val1: '+45 kg Downforce',
      label2: 'Aero Efficiency',
      val2: 'Double SF90 Standard',
      description: 'Wider front splitter and prominent side canards guide airflow into radiator ducts while generating immediate turn-in bite.',
    },
    hotspots: [
      { x: 26, y: 64, title: 'Matrix LED Headlamps', spec: 'Horizontal slit signature with integrated cooling ducts' },
      { x: 45, y: 84, title: 'Front Splitter Canards', spec: 'Directs vortex airflow around 20-inch carbon rims' },
    ],
  },
  {
    id: 'shot-4',
    src: '/cars/2024-ferrari-sf90-xx-stradale-102-654a668c8eefa.jpg',
    title: 'Front Fascia & Splitter Engineering',
    subtitle: 'Dual S-Duct & Symmetrical Air Curtains',
    category: 'Aerodynamics',
    location: 'Wind Tunnel Testing Ground',
    telemetry: {
      label1: 'Cooling Airflow',
      val1: '+18% Volumetric Flow',
      label2: 'Brake Cooling',
      val2: 'Dual Inverted Air Scoops',
      description: 'Front hood vents evacuate hot radiator exhaust upward over the windscreen to minimize drag and avoid turbulent underbody air.',
    },
    hotspots: [
      { x: 50, y: 68, title: 'S-Duct Exhaust', spec: 'Channeling high-velocity air through the carbon front hood' },
    ],
  },
  {
    id: 'shot-5',
    src: '/cars/2024-ferrari-sf90-xx-stradale-103-654a668d31cb4.jpg',
    title: 'Longtail Silhouette & Carbon Monocoque',
    subtitle: 'Streamlined Profile with Dorsal Air Fins',
    category: 'Aerodynamics',
    location: 'Maranello Proving Ground',
    telemetry: {
      label1: 'Wheelbase',
      val1: '2,650 mm',
      label2: 'Dry Weight',
      val2: '1,560 kg',
      description: 'Elongated rear bodywork improves boundary layer adhesion, creating the iconic XX Program silhouette.',
    },
    hotspots: [
      { x: 62, y: 36, title: 'Dual Dorsal Fins', spec: 'Guides laminar airflow directly into V8 intake airboxes' },
    ],
  },
  {
    id: 'shot-6',
    src: '/cars/2024-ferrari-sf90-xx-stradale-105-654a668cc2591.jpg',
    title: 'Rear Carbon Wing & Twin Exhaust',
    subtitle: 'Central High-Exit Inconel Pipes',
    category: 'Rear Section',
    location: 'Pista di Fiorano · Pitlane',
    telemetry: {
      label1: 'Exhaust Note',
      val1: '115 dB Harmonic V8',
      label2: 'Diffuser Expansion',
      val2: '4-Strake Carbon Assembly',
      description: 'The elevated exhaust pipes allow the lower diffuser to expand uninterrupted across the entire width of the car.',
    },
    hotspots: [
      { x: 50, y: 62, title: 'Twin High-Exit Pipes', spec: 'Inconel and titanium exhaust tuned for F1-inspired acoustic resonance' },
      { x: 50, y: 32, title: 'Active Shut-Off Gurney', spec: 'Low Drag / High Downforce automated hydraulic transition' },
    ],
  },
  {
    id: 'shot-7',
    src: '/cars/2024-ferrari-sf90-xx-stradale-109-654a668fc71a3.jpg',
    title: 'Carbon Monocoque Racing Cockpit',
    subtitle: 'Lightweight Technical Alcantara Interior',
    category: 'Cockpit',
    location: 'Ferrari Tailor Made Atelier',
    telemetry: {
      label1: 'Weight Reduction',
      val1: '-21.5 kg Interior',
      label2: 'Harness',
      val2: '4-Point Sabelt Racing',
      description: 'Stripped for ultimate track performance with exposed matte carbon fiber, technical fabric door panels, and lightweight carbon racing seats.',
    },
    hotspots: [
      { x: 45, y: 60, title: 'Carbon Bucket Seat', spec: 'Pre-preg carbon fiber shell saving 1.3 kg per seat' },
    ],
  },
  {
    id: 'shot-8',
    src: '/cars/2024-ferrari-sf90-xx-stradale-110-654a6690401bb.jpg',
    title: 'F1 Steering Wheel & Touch Manettino',
    subtitle: 'Driver-Centric Ergonomics & Curved 16" Cluster',
    category: 'Cockpit',
    location: 'Ferrari Simulator Laboratory',
    telemetry: {
      label1: 'Manettino Modes',
      val1: 'Wet, Sport, Race, CT Off, ESC Off',
      label2: 'Digital Display',
      val2: '16" Full-HD Curved Panel',
      description: 'All vehicle dynamics, hybrid energy recovery modes, and Extra Boost activation are controlled directly without lifting hands.',
    },
    hotspots: [
      { x: 50, y: 55, title: 'Touch Manettino', spec: 'Instant toggle between Hybrid, Performance, and Qualify modes' },
    ],
  },
  {
    id: 'shot-9',
    src: '/cars/2024-ferrari-sf90-xx-stradale-111-654a6690e059b.jpg',
    title: 'Front Fender Louver Micro-Architecture',
    subtitle: 'Direct Aerodynamic Extraction Gills',
    category: 'Details',
    location: 'Aero Composite Cleanroom',
    telemetry: {
      label1: 'Pressure Relief',
      val1: '-30% Wheel Well Lift',
      label2: 'Material',
      val2: 'Pre-Preg Carbon Fiber',
      description: 'Triple louvers on each front fender extract turbulent air kicked up by the spinning front Michelin Pilot Sport Cup 2 R tires.',
    },
    hotspots: [
      { x: 50, y: 50, title: 'Triple Gills', spec: 'Aerodynamically profiled slats with Flash Orange contrast edging' },
    ],
  },
  {
    id: 'shot-10',
    src: '/cars/2024-ferrari-sf90-xx-stradale-114-654a669486a42.jpg',
    title: 'Titanium Tailpipe & Heat Mesh Grille',
    subtitle: 'Extreme Thermal Dissipation Architecture',
    category: 'Details',
    location: 'Scuderia Ferrari Powertrain Division',
    telemetry: {
      label1: 'Exhaust Temp',
      val1: '950 °C Peak',
      label2: 'Material',
      val2: 'Titanium / Inconel 625',
      description: 'Laser-perforated stainless mesh allows maximum heat dissipation from the 4.0-liter twin-turbocharged combustion engine.',
    },
    hotspots: [
      { x: 52, y: 48, title: 'Central Exit Pipes', spec: 'Repositioned upward to optimize underfloor aerodynamics' },
    ],
  },
  {
    id: 'shot-11',
    src: '/cars/2024-ferrari-sf90-xx-stradale-119-654a6698215b0.jpg',
    title: 'Overhead Aerodynamic Flow Profile',
    subtitle: 'NACA Ducts & Mid-Engine Roof Scoop',
    category: 'Aerodynamics',
    location: 'Ferrari Aero Design Studio',
    telemetry: {
      label1: 'Roof Airflow',
      val1: 'Zero Boundary Separation',
      label2: 'Cooling Ducting',
      val2: 'Dual NACA Inlets',
      description: 'View from above highlights the dramatic tapering of the cockpit greenhouse into the rear wing endplates.',
    },
  },
  {
    id: 'shot-12',
    src: '/cars/2024-ferrari-sf90-xx-stradale-120-654a669829bf5.jpg',
    title: 'Sunset Fiorano Track Session',
    subtitle: 'The XX Program Legacy Brought to the Open Road',
    category: 'Track Action',
    location: 'Pista di Fiorano · Curva del Bosco',
    telemetry: {
      label1: 'Lap Record',
      val1: '1:17.309 at Fiorano',
      label2: 'Production Run',
      val2: 'Limited to 799 Coupes',
      description: 'The fastest street-legal Ferrari ever to lap the Fiorano test track, eclipsing the standard SF90 by 1.4 seconds.',
    },
  },
];

export const RealCarShowcase: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeHotspot, setActiveHotspot] = useState<{ title: string; spec: string } | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const timerRef = useRef<number | null>(null);

  const currentShot = SF90_XX_PHOTOS[activeIndex];

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying) return;
    timerRef.current = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % SF90_XX_PHOTOS.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, activeIndex]);

  // Handle keyboard arrow navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev + 1) % SF90_XX_PHOTOS.length);
      } else if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev - 1 + SF90_XX_PHOTOS.length) % SF90_XX_PHOTOS.length);
      } else if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Audio Synthesizer: Twin-Turbo V8 hybrid roar
  const playV8Roar = () => {
    if (audioPlaying) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;
      setAudioPlaying(true);

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const oscSub = ctx.createOscillator();
      const gainNode = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      oscSub.type = 'triangle';

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(3600, ctx.currentTime + 1.2);
      filter.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 2.5);

      const now = ctx.currentTime;
      // Idle to redline rev
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(380, now + 1.2);
      osc1.frequency.exponentialRampToValueAtTime(95, now + 2.5);

      osc2.frequency.setValueAtTime(68, now);
      osc2.frequency.exponentialRampToValueAtTime(395, now + 1.2);
      osc2.frequency.exponentialRampToValueAtTime(98, now + 2.5);

      oscSub.frequency.setValueAtTime(33, now);
      oscSub.frequency.exponentialRampToValueAtTime(190, now + 1.2);
      oscSub.frequency.exponentialRampToValueAtTime(48, now + 2.5);

      gainNode.gain.setValueAtTime(0.01, now);
      gainNode.gain.linearRampToValueAtTime(0.45, now + 0.3);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 2.6);

      osc1.connect(filter);
      osc2.connect(filter);
      oscSub.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      oscSub.start(now);
      osc1.stop(now + 2.7);
      osc2.stop(now + 2.7);
      oscSub.stop(now + 2.7);

      setTimeout(() => {
        setAudioPlaying(false);
      }, 2700);
    } catch {
      setAudioPlaying(false);
    }
  };

  const categories = ['All', 'Track Action', 'Aerodynamics', 'Cockpit', 'Details', 'Rear Section'];

  const filteredPhotos =
    selectedCategory === 'All'
      ? SF90_XX_PHOTOS
      : SF90_XX_PHOTOS.filter((p) => p.category === selectedCategory);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        background: '#070709',
        color: '#FFF',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      {/* Top Filter Category & Control Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          padding: '16px 24px',
          background: 'rgba(10, 10, 14, 0.95)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          zIndex: 10,
          position: 'relative',
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', color: '#E10600' }}>
              OFFICIAL GALLERY
            </span>
            <span style={{ fontSize: '0.72rem', color: '#888' }}>({SF90_XX_PHOTOS.length} 4K Photos)</span>
          </div>

          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: selectedCategory === cat ? '1px solid #E10600' : '1px solid rgba(255, 255, 255, 0.1)',
                background: selectedCategory === cat ? 'rgba(225, 6, 0, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedCategory === cat ? '#FFF' : '#A0A0B0',
                fontSize: '0.78rem',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Action Controls: Sound Roar & Slideshow Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            onClick={playV8Roar}
            disabled={audioPlaying}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '7px 14px',
              borderRadius: '8px',
              background: audioPlaying
                ? 'linear-gradient(90deg, #E10600, #FF5500)'
                : 'rgba(225, 6, 0, 0.15)',
              border: '1px solid #E10600',
              color: '#FFF',
              fontSize: '0.8rem',
              fontWeight: '700',
              cursor: audioPlaying ? 'default' : 'pointer',
              boxShadow: audioPlaying ? '0 0 15px rgba(225, 6, 0, 0.6)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {audioPlaying ? <Volume2 size={15} /> : <VolumeX size={15} />}
            {audioPlaying ? 'Roaring V8 (1,030 CV)...' : 'Hear 1,030 CV V8 Roar'}
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Slideshow' : 'Start Auto-Play'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFF',
              cursor: 'pointer',
            }}
          >
            {isPlaying ? <Pause size={14} /> : <Play size={14} />}
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            title="Inspect Fullscreen"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFF',
              cursor: 'pointer',
            }}
          >
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Main Real Car Cinema Stage */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: isFullscreen ? '90vh' : 'clamp(460px, 62vh, 680px)',
          background: '#040406',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Main High-Resolution Real Photograph */}
        <img
          key={currentShot.id}
          src={currentShot.src}
          alt={currentShot.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center 45%',
            animation: 'fadeInPhoto 0.6s ease-out forwards',
            filter: 'contrast(1.04) brightness(0.98)',
          }}
        />

        {/* Ambient Dark Vignette & Shadow Gradients */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(180deg, rgba(7,7,9,0.55) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 70%, rgba(7,7,9,0.92) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background:
              'linear-gradient(90deg, rgba(7,7,9,0.6) 0%, rgba(0,0,0,0) 20%, rgba(0,0,0,0) 80%, rgba(7,7,9,0.6) 100%)',
          }}
        />

        {/* Interactive Pulsing Radar Hotspots */}
        {currentShot.hotspots &&
          currentShot.hotspots.map((spot, idx) => (
            <div
              key={idx}
              style={{
                position: 'absolute',
                top: `${spot.y}%`,
                left: `${spot.x}%`,
                transform: 'translate(-50%, -50%)',
                zIndex: 12,
              }}
            >
              <button
                onClick={() =>
                  setActiveHotspot(
                    activeHotspot?.title === spot.title ? null : { title: spot.title, spec: spot.spec }
                  )
                }
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: 'rgba(225, 6, 0, 0.9)',
                  border: '2px solid #FFD700',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: '0 0 16px rgba(225, 6, 0, 0.9), 0 0 24px rgba(255, 215, 0, 0.5)',
                  animation: 'pulseGlow 2s infinite',
                  padding: 0,
                }}
                title={`Inspect: ${spot.title}`}
              >
                <Info size={14} />
              </button>
            </div>
          ))}

        {/* Active Hotspot Popover Callout */}
        {activeHotspot && (
          <div
            style={{
              position: 'absolute',
              top: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(15, 15, 20, 0.95)',
              backdropFilter: 'blur(16px)',
              border: '1px solid #FFD700',
              borderRadius: '12px',
              padding: '14px 20px',
              zIndex: 20,
              boxShadow: '0 12px 35px rgba(0,0,0,0.8), 0 0 20px rgba(255, 215, 0, 0.2)',
              maxWidth: '380px',
              textAlign: 'center',
              animation: 'fadeInUp 0.3s ease-out forwards',
            }}
          >
            <div style={{ color: '#FFD700', fontSize: '0.75rem', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
              ✦ Maranello Engineering Inspection
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF', marginBottom: '4px' }}>
              {activeHotspot.title}
            </div>
            <div style={{ fontSize: '0.82rem', color: '#C0C0D0', lineHeight: 1.4 }}>
              {activeHotspot.spec}
            </div>
            <button
              onClick={() => setActiveHotspot(null)}
              style={{
                marginTop: '10px',
                padding: '4px 12px',
                borderRadius: '6px',
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#FFF',
                fontSize: '0.72rem',
                cursor: 'pointer',
              }}
            >
              Close Spec
            </button>
          </div>
        )}

        {/* Previous & Next Navigation Arrows */}
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + SF90_XX_PHOTOS.length) % SF90_XX_PHOTOS.length)}
          style={{
            position: 'absolute',
            left: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(10, 10, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 15,
            transition: 'all 0.2s',
          }}
          title="Previous Photo (Left Arrow)"
        >
          <ChevronLeft size={24} />
        </button>

        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % SF90_XX_PHOTOS.length)}
          style={{
            position: 'absolute',
            right: '20px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(10, 10, 14, 0.75)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#FFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            zIndex: 15,
            transition: 'all 0.2s',
          }}
          title="Next Photo (Right Arrow)"
        >
          <ChevronRight size={24} />
        </button>

        {/* Bottom Left Corner: Photo Title & Location Badge */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            left: '32px',
            zIndex: 15,
            maxWidth: '520px',
          }}
        >
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                background: '#E10600',
                color: '#FFF',
                fontSize: '0.68rem',
                fontWeight: '900',
                letterSpacing: '0.12em',
                padding: '2px 8px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              {currentShot.category}
            </span>
            <span style={{ color: '#FFD700', fontSize: '0.78rem', fontWeight: '600' }}>
              {currentShot.location}
            </span>
          </div>

          <h2
            style={{
              fontSize: 'clamp(1.5rem, 2.8vw, 2.2rem)',
              fontWeight: '900',
              lineHeight: 1.1,
              letterSpacing: '-0.01em',
              textTransform: 'uppercase',
              color: '#FFF',
              margin: '0 0 6px 0',
              textShadow: '0 2px 10px rgba(0,0,0,0.8)',
            }}
          >
            {currentShot.title}
          </h2>

          <p
            style={{
              fontSize: '0.88rem',
              color: '#D0D0E0',
              margin: 0,
              textShadow: '0 1px 8px rgba(0,0,0,0.8)',
              lineHeight: 1.4,
            }}
          >
            {currentShot.subtitle}
          </p>
        </div>

        {/* Bottom Right Corner: Live Telemetry Glass Card */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            right: '32px',
            zIndex: 15,
            background: 'rgba(15, 15, 20, 0.85)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(225, 6, 0, 0.4)',
            borderRadius: '12px',
            padding: '14px 18px',
            maxWidth: '320px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', marginBottom: '8px' }}>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#8E8E9F', textTransform: 'uppercase', fontWeight: '700' }}>
                {currentShot.telemetry.label1}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#FFD700', fontFamily: 'monospace' }}>
                {currentShot.telemetry.val1}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.68rem', color: '#8E8E9F', textTransform: 'uppercase', fontWeight: '700' }}>
                {currentShot.telemetry.label2}
              </div>
              <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#00D084', fontFamily: 'monospace' }}>
                {currentShot.telemetry.val2}
              </div>
            </div>
          </div>
          <div style={{ fontSize: '0.74rem', color: '#A0A0B5', lineHeight: 1.35 }}>
            {currentShot.telemetry.description}
          </div>
        </div>
      </div>

      {/* 12-Shot Thumbnail Filmstrip Strip */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          padding: '16px 24px',
          background: '#0A0A0E',
          overflowX: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          scrollbarWidth: 'thin',
        }}
      >
        {filteredPhotos.map((photo, idx) => {
          const globalIdx = SF90_XX_PHOTOS.findIndex((p) => p.id === photo.id);
          const isSelected = globalIdx === activeIndex;

          return (
            <button
              key={photo.id}
              onClick={() => {
                setActiveIndex(globalIdx);
                setActiveHotspot(null);
              }}
              style={{
                flex: '0 0 140px',
                height: '84px',
                borderRadius: '8px',
                overflow: 'hidden',
                position: 'relative',
                border: isSelected ? '2px solid #E10600' : '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: isSelected ? '0 0 16px rgba(225, 6, 0, 0.6)' : 'none',
                cursor: 'pointer',
                background: '#15151C',
                padding: 0,
                transform: isSelected ? 'scale(1.03)' : 'scale(1)',
                transition: 'all 0.2s',
              }}
              title={photo.title}
            >
              <img
                src={photo.src}
                alt={photo.title}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  opacity: isSelected ? 1 : 0.65,
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '2px 4px',
                  background: 'rgba(0,0,0,0.8)',
                  fontSize: '0.62rem',
                  fontWeight: '700',
                  color: isSelected ? '#FFD700' : '#BBB',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  textAlign: 'center',
                }}
              >
                {photo.title}
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        @keyframes fadeInPhoto {
          from { opacity: 0.6; transform: scale(1.02); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulseGlow {
          0% { box-shadow: 0 0 0 0 rgba(225, 6, 0, 0.7); }
          70% { box-shadow: 0 0 0 12px rgba(225, 6, 0, 0); }
          100% { box-shadow: 0 0 0 0 rgba(225, 6, 0, 0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 10px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
};
