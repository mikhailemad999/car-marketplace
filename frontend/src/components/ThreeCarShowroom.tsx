import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  RotateCcw,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Zap,
  Info,
  Layers,
  Image as ImageIcon,
  Box,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Flame,
} from 'lucide-react';

export interface PaintOption {
  name: string;
  code: string;
  hex: string;
  metallic: number;
  roughness: number;
  accentHex: string;
}

export const FERRARI_XX_COLORS: PaintOption[] = [
  { name: 'Rosso Corsa & Flash Orange', code: 'FER-XX-01', hex: '#D40000', metallic: 0.88, roughness: 0.2, accentHex: '#FF5500' },
  { name: 'Nero Daytona & Flash Orange', code: 'FER-XX-02', hex: '#0D0D10', metallic: 0.95, roughness: 0.16, accentHex: '#FF5500' },
  { name: 'Giallo Modena & Carbon Black', code: 'FER-XX-03', hex: '#FDD017', metallic: 0.82, roughness: 0.22, accentHex: '#111111' },
  { name: 'Grigio Scuro & Rosso Corsa', code: 'FER-XX-04', hex: '#4A4E57', metallic: 0.92, roughness: 0.18, accentHex: '#D40000' },
  { name: 'Bianco Avus & Flash Orange', code: 'FER-XX-05', hex: '#F0F1F5', metallic: 0.78, roughness: 0.24, accentHex: '#FF5500' },
];

export interface CameraPreset {
  id: string;
  name: string;
  pos: [number, number, number];
  target: [number, number, number];
  description: string;
}

const CAMERA_PRESETS: CameraPreset[] = [
  { id: 'hero', name: 'Showroom 3/4', pos: [4.4, 1.7, 4.6], target: [0, 0.45, 0], description: 'Iconic front three-quarter perspective' },
  { id: 'rear_wing', name: 'XX Fixed Rear Wing', pos: [-3.2, 1.8, -4.6], target: [0, 0.7, -1.6], description: 'Fixed carbon rear wing delivering 530 kg downforce' },
  { id: 'aero_gills', name: 'Fender Louvers', pos: [2.6, 1.2, 1.8], target: [0.9, 0.5, 1.2], description: 'Triple cooling vents carved over front wheels' },
  { id: 'cockpit', name: 'Teardrop Cockpit', pos: [5.0, 1.2, 0], target: [0, 0.5, 0], description: 'Aeronautical canopy & side NACA intakes' },
  { id: 'top_down', name: 'Aero Flow Top', pos: [0, 6.8, 0.1], target: [0, 0, 0], description: 'Dorsal fins & aerodynamic airflow management' },
];

interface Hotspot {
  id: string;
  title: string;
  spec: string;
  description: string;
  worldPos: THREE.Vector3;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'xx_wing',
    title: 'Twin-Profile Fixed Rear Wing',
    spec: '530 kg Downforce @ 250 km/h',
    description: 'First road-legal Ferrari since the F50 with a fixed carbon wing. Works with active shut-off Gurney for extreme track downforce.',
    worldPos: new THREE.Vector3(0, 1.25, -2.1),
  },
  {
    id: 'engine',
    title: '4.0L Twin-Turbo V8 + Tri-Motor XX',
    spec: '1,030 CV (+30 CV Extra Boost)',
    description: 'Specially polished intake ducts, revised combustion chambers, and Extra Boost logic derived directly from Scuderia F1.',
    worldPos: new THREE.Vector3(0, 0.85, -0.75),
  },
  {
    id: 'fender_louvers',
    title: 'Triple Front Fender Gills',
    spec: 'Dynamic Wheel Well Pressure Relief',
    description: 'Three functional vents above each front wheel extracting high-pressure air from the wheel wells to enhance front grip.',
    worldPos: new THREE.Vector3(0.95, 0.7, 1.3),
  },
  {
    id: 'exhaust',
    title: 'High-Mounted Titanium Twin Pipes',
    spec: 'Straight-Through Acoustic Resonators',
    description: 'Centralized titanium exhaust outlets tuned to channel high-frequency V8 harmonics straight into the cabin.',
    worldPos: new THREE.Vector3(0, 0.55, -2.3),
  },
];

// Track photos converted from e:\AMIT AI\car\picture
const REFERENCE_PHOTOS = [
  { url: '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg', title: 'SF90 XX Stradale Track Launch', subtitle: 'Dynamic high-speed cornering at Fiorano' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-102-654a668c8eefa.jpg', title: 'Fixed Carbon Rear Wing & Diffuser', subtitle: 'Twin titanium pipes and 530 kg downforce profile' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-103-654a668d31cb4.jpg', title: 'Front Aero & Triple Louvers', subtitle: 'Aggressive carbon splitter and matrix headlights' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-105-654a668cc2591.jpg', title: 'Low-Slung Side Profile', subtitle: 'Aerodynamic side air intakes and 20" forged rims' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-119-654a6698215b0.jpg', title: 'Carbon Wing Endplate Detail', subtitle: 'Flash Orange aero accents and carbon weave' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-114-654a669486a42.jpg', title: 'Front Carbon Splitter Canards', subtitle: 'Downforce vortex generation' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-120-654a669829bf5.jpg', title: 'Brembo Carbon-Ceramic Matrix', subtitle: 'Lightweight forged wheels with red calipers' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-111-654a6690e059b.jpg', title: '1,030 CV Twin-Turbo V8 Bay', subtitle: 'Red crackle finish intake plenums' },
  { url: '/cars/2024-ferrari-sf90-xx-stradale-109-654a668fc71a3.jpg', title: 'Cockpit & Carbon Racing Seats', subtitle: 'Alcantara appointments with contrast stitching' },
  { url: '/cars/2024-ferrari-sf90xx-134-6552496c82eea.jpg', title: 'Fiorano Circuit High Downforce Run', subtitle: 'Full aerodynamic stability at 320 km/h' },
];

export const ThreeCarShowroom: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'gallery'>('3d');
  const [activeColor, setActiveColor] = useState<PaintOption>(FERRARI_XX_COLORS[0]);
  const [activePreset, setActivePreset] = useState<string>('hero');
  const [isNightMode, setIsNightMode] = useState<boolean>(false);
  const [isAutoRotate, setIsAutoRotate] = useState<boolean>(true);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [isExtraBoost, setIsExtraBoost] = useState<boolean>(false);
  const [isRevving, setIsRevving] = useState<boolean>(false);
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);
  const [hotspotScreenPositions, setHotspotScreenPositions] = useState<Record<string, { x: number; y: number }>>({});
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState<number>(0);

  // Audio refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineNodesRef = useRef<any>(null);

  // Three.js scene refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const carPaintMaterialsRef = useRef<THREE.MeshPhysicalMaterial[]>([]);
  const accentMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const exhaustFlamesRef = useRef<THREE.Mesh[]>([]);
  const targetCamPosRef = useRef<THREE.Vector3>(new THREE.Vector3(4.4, 1.7, 4.6));
  const targetLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.45, 0));
  const currentLookAtRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0.45, 0));

  // Audio Engine: V8 Hybrid + Extra Boost Sound Simulation
  const toggleSound = () => {
    if (isSoundOn) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setIsSoundOn(false);
      setIsRevving(false);
    } else {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const subOsc = ctx.createOscillator();
        const boostOsc = ctx.createOscillator();
        const gainNode = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.type = 'sawtooth';
        osc2.type = 'triangle';
        subOsc.type = 'sine';
        boostOsc.type = 'sine';

        osc1.frequency.setValueAtTime(48, ctx.currentTime);
        osc2.frequency.setValueAtTime(96, ctx.currentTime);
        subOsc.frequency.setValueAtTime(24, ctx.currentTime);
        boostOsc.frequency.setValueAtTime(1200, ctx.currentTime); // Electric motor whine

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, ctx.currentTime);

        gainNode.gain.setValueAtTime(0.14, ctx.currentTime);

        osc1.connect(filter);
        osc2.connect(filter);
        subOsc.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();
        subOsc.start();

        engineNodesRef.current = { osc1, osc2, subOsc, boostOsc, filter, gainNode };
        setIsSoundOn(true);
      } catch (err) {
        console.error('Audio initialization error:', err);
      }
    }
  };

  const triggerRev = (revving: boolean) => {
    setIsRevving(revving);
    if (!audioCtxRef.current || !engineNodesRef.current) return;
    const ctx = audioCtxRef.current;
    const { osc1, osc2, subOsc, filter, gainNode } = engineNodesRef.current;

    const now = ctx.currentTime;
    if (revving) {
      const targetRPMFreq = isExtraBoost ? 380 : 320;
      osc1.frequency.cancelScheduledValues(now);
      osc2.frequency.cancelScheduledValues(now);
      subOsc.frequency.cancelScheduledValues(now);
      filter.frequency.cancelScheduledValues(now);
      gainNode.gain.cancelScheduledValues(now);

      osc1.frequency.exponentialRampToValueAtTime(targetRPMFreq, now + 0.5);
      osc2.frequency.exponentialRampToValueAtTime(targetRPMFreq * 2, now + 0.5);
      subOsc.frequency.exponentialRampToValueAtTime(targetRPMFreq / 2, now + 0.5);
      filter.frequency.exponentialRampToValueAtTime(isExtraBoost ? 3600 : 2500, now + 0.5);
      gainNode.gain.linearRampToValueAtTime(0.38, now + 0.1);
    } else {
      osc1.frequency.cancelScheduledValues(now);
      osc2.frequency.cancelScheduledValues(now);
      subOsc.frequency.cancelScheduledValues(now);
      filter.frequency.cancelScheduledValues(now);
      gainNode.gain.cancelScheduledValues(now);

      osc1.frequency.exponentialRampToValueAtTime(48, now + 0.9);
      osc2.frequency.exponentialRampToValueAtTime(96, now + 0.9);
      subOsc.frequency.exponentialRampToValueAtTime(24, now + 0.9);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.9);
      gainNode.gain.linearRampToValueAtTime(0.14, now + 0.3);
    }
  };

  const toggleExtraBoost = () => {
    const nextState = !isExtraBoost;
    setIsExtraBoost(nextState);

    // Toggle exhaust flame visibility
    exhaustFlamesRef.current.forEach((flame) => {
      flame.visible = nextState;
    });

    if (isSoundOn && nextState) {
      triggerRev(true);
      setTimeout(() => triggerRev(false), 2200);
    }
  };

  const handleColorChange = (color: PaintOption) => {
    setActiveColor(color);
    carPaintMaterialsRef.current.forEach((mat) => {
      mat.color.set(color.hex);
      mat.metalness = color.metallic;
      mat.roughness = color.roughness;
      mat.needsUpdate = true;
    });
    accentMaterialsRef.current.forEach((mat) => {
      mat.color.set(color.accentHex);
      mat.needsUpdate = true;
    });
  };

  const handlePresetChange = (preset: CameraPreset) => {
    setActivePreset(preset.id);
    setIsAutoRotate(false);
    targetCamPosRef.current.set(...preset.pos);
    targetLookAtRef.current.set(...preset.target);
  };

  // Build the Authentic Ferrari SF90 XX Stradale 3D Model
  const buildFerrariSF90XX = (scene: THREE.Scene) => {
    const carGroup = new THREE.Group();
    carGroup.name = 'FerrariSF90XXStradale';

    // PBR MATERIALS
    const paintMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeColor.hex),
      metalness: activeColor.metallic,
      roughness: activeColor.roughness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      reflectivity: 0.95,
    });
    carPaintMaterialsRef.current.push(paintMaterial);

    const carbonFiberMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x101014),
      roughness: 0.3,
      metalness: 0.65,
    });

    const accentMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(activeColor.accentHex),
      roughness: 0.25,
      metalness: 0.5,
    });
    accentMaterialsRef.current.push(accentMat);

    const glassMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x0a0d14),
      metalness: 0.9,
      roughness: 0.05,
      transmission: 0.75,
      transparent: true,
      opacity: 0.88,
    });

    const chromeMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xdde2e8),
      metalness: 0.95,
      roughness: 0.1,
    });

    const brakeRotorMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0x35373a),
      metalness: 0.7,
      roughness: 0.3,
    });

    const redCaliperMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xd40000),
      metalness: 0.4,
      roughness: 0.2,
    });

    const headlightEmissive = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xffffff),
      emissive: new THREE.Color(0xb5e5ff),
      emissiveIntensity: 3.5,
    });

    const taillightEmissive = new THREE.MeshStandardMaterial({
      color: new THREE.Color(0xff0000),
      emissive: new THREE.Color(0xff0000),
      emissiveIntensity: 4.0,
    });

    // 1. LOWER UNDERBODY & CARBON TUB
    const bellyGeo = new THREE.BoxGeometry(1.82, 0.18, 4.45);
    const belly = new THREE.Mesh(bellyGeo, carbonFiberMat);
    belly.position.set(0, 0.19, 0);
    belly.castShadow = true;
    carGroup.add(belly);

    // 2. SCULPTED XX WEDGE NOSE & HOOD VENTS
    const noseGeo = new THREE.ConeGeometry(1.35, 1.85, 4);
    const nose = new THREE.Mesh(noseGeo, paintMaterial);
    nose.rotation.x = Math.PI / 2;
    nose.rotation.y = Math.PI / 4;
    nose.scale.set(1.22, 1.0, 0.36);
    nose.position.set(0, 0.38, 1.62);
    nose.castShadow = true;
    carGroup.add(nose);

    // Center Cabin Hood Section
    const hoodGeo = new THREE.BoxGeometry(1.7, 0.36, 1.95);
    const hood = new THREE.Mesh(hoodGeo, paintMaterial);
    hood.position.set(0, 0.46, 0.5);
    hood.castShadow = true;
    carGroup.add(hood);

    // SF90 XX Hood Center Channel & Air Outlets (Front S-Duct)
    const hoodVentGeo = new THREE.BoxGeometry(0.7, 0.05, 0.9);
    const hoodVent = new THREE.Mesh(hoodVentGeo, carbonFiberMat);
    hoodVent.position.set(0, 0.52, 0.95);
    carGroup.add(hoodVent);

    // Hood Vent Accent Pinstripe (Flash Orange / Accent)
    const ventAccentGeo = new THREE.BoxGeometry(0.72, 0.02, 0.08);
    const ventAccent = new THREE.Mesh(ventAccentGeo, accentMat);
    ventAccent.position.set(0, 0.54, 0.52);
    carGroup.add(ventAccent);

    // 3. FRONT FENDERS WITH FUNCTIONAL TRIPLE COOLING LOUVERS (XX SIGNATURE)
    const frontFenderGeo = new THREE.CylinderGeometry(0.38, 0.42, 0.28, 24);
    frontFenderGeo.rotateZ(Math.PI / 2);
    const frontFenderL = new THREE.Mesh(frontFenderGeo, paintMaterial);
    frontFenderL.position.set(-0.95, 0.38, 1.35);
    frontFenderL.scale.set(1, 1, 1.4);
    const frontFenderR = new THREE.Mesh(frontFenderGeo, paintMaterial);
    frontFenderR.position.set(0.95, 0.38, 1.35);
    frontFenderR.scale.set(1, 1, 1.4);
    carGroup.add(frontFenderL, frontFenderR);

    // 3 Louvers / Gills on Each Front Fender (As seen in picture reference!)
    for (let i = 0; i < 3; i++) {
      const louverGeo = new THREE.BoxGeometry(0.18, 0.02, 0.05);
      const zOffset = 1.25 + i * 0.1;

      const louverL = new THREE.Mesh(louverGeo, carbonFiberMat);
      louverL.position.set(-0.92, 0.65, zOffset);
      louverL.rotation.x = -0.3;

      const louverR = new THREE.Mesh(louverGeo, carbonFiberMat);
      louverR.position.set(0.92, 0.65, zOffset);
      louverR.rotation.x = -0.3;

      carGroup.add(louverL, louverR);
    }

    // 4. FRONT CARBON SPLITTER & AERODYNAMIC CANARDS / DIVE PLANES
    const splitterGeo = new THREE.BoxGeometry(2.02, 0.06, 0.55);
    const splitter = new THREE.Mesh(splitterGeo, carbonFiberMat);
    splitter.position.set(0, 0.11, 2.24);
    splitter.castShadow = true;
    carGroup.add(splitter);

    // Splitter Lip Accent Stripe (Flash Orange)
    const splitterAccentGeo = new THREE.BoxGeometry(2.04, 0.02, 0.04);
    const splitterAccent = new THREE.Mesh(splitterAccentGeo, accentMat);
    splitterAccent.position.set(0, 0.12, 2.5);
    carGroup.add(splitterAccent);

    // Front Bumper Dive Planes / Canards (Left & Right)
    const canardGeo = new THREE.BoxGeometry(0.24, 0.02, 0.18);
    canardGeo.rotateZ(0.2);
    const canardL = new THREE.Mesh(canardGeo, carbonFiberMat);
    canardL.position.set(-0.96, 0.32, 2.12);
    const canardR = new THREE.Mesh(canardGeo, carbonFiberMat);
    canardR.position.set(0.96, 0.32, 2.12);
    canardR.rotation.z = -0.2;
    carGroup.add(canardL, canardR);

    // Ferrari Front Cavallino Emblem
    const shieldGeo = new THREE.BoxGeometry(0.1, 0.08, 0.02);
    const yellowShieldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, roughness: 0.3 });
    const shield = new THREE.Mesh(shieldGeo, yellowShieldMat);
    shield.position.set(0, 0.38, 2.18);
    carGroup.add(shield);

    // 5. TEARDROP COCKPIT & CARBON ROOF
    const roofGeo = new THREE.SphereGeometry(0.85, 32, 16);
    const roof = new THREE.Mesh(roofGeo, glassMat);
    roof.scale.set(0.95, 0.48, 1.45);
    roof.position.set(0, 0.68, -0.15);
    roof.castShadow = true;
    carGroup.add(roof);

    // Full Carbon Fiber Roof Panel
    const roofCapGeo = new THREE.BoxGeometry(0.92, 0.08, 1.25);
    const roofCap = new THREE.Mesh(roofCapGeo, carbonFiberMat);
    roofCap.position.set(0, 0.91, -0.15);
    carGroup.add(roofCap);

    // Side Mirrors
    const mirrorCapGeo = new THREE.BoxGeometry(0.2, 0.08, 0.12);
    const mirrorL = new THREE.Mesh(mirrorCapGeo, carbonFiberMat);
    mirrorL.position.set(-0.99, 0.65, 0.35);
    const mirrorR = new THREE.Mesh(mirrorCapGeo, carbonFiberMat);
    mirrorR.position.set(0.99, 0.65, 0.35);
    carGroup.add(mirrorL, mirrorR);

    // 6. REAR HAUNCHES & DORSAL SPINE ENGINE DECK
    const rearHaunchGeo = new THREE.CylinderGeometry(0.42, 0.46, 0.32, 24);
    rearHaunchGeo.rotateZ(Math.PI / 2);
    const rearHaunchL = new THREE.Mesh(rearHaunchGeo, paintMaterial);
    rearHaunchL.position.set(-0.96, 0.42, -1.25);
    rearHaunchL.scale.set(1, 1, 1.5);
    const rearHaunchR = new THREE.Mesh(rearHaunchGeo, paintMaterial);
    rearHaunchR.position.set(0.96, 0.42, -1.25);
    rearHaunchR.scale.set(1, 1, 1.5);
    carGroup.add(rearHaunchL, rearHaunchR);

    // Engine Bay Glass & Visible V8 Plenum
    const engineCoverGeo = new THREE.BoxGeometry(1.1, 0.06, 1.1);
    const engineCover = new THREE.Mesh(engineCoverGeo, glassMat);
    engineCover.position.set(0, 0.6, -1.0);
    carGroup.add(engineCover);

    const v8PlenumGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.7, 16);
    v8PlenumGeo.rotateZ(Math.PI / 2);
    const v8ManifoldL = new THREE.Mesh(v8PlenumGeo, redCaliperMat);
    v8ManifoldL.position.set(-0.2, 0.48, -0.95);
    const v8ManifoldR = new THREE.Mesh(v8PlenumGeo, redCaliperMat);
    v8ManifoldR.position.set(0.2, 0.48, -0.95);
    carGroup.add(v8ManifoldL, v8ManifoldR);

    // DORSAL AERO FINS (SF90 XX STRADALE KEY TRAIT)
    const dorsalFinGeo = new THREE.BoxGeometry(0.04, 0.18, 0.85);
    const dorsalFinL = new THREE.Mesh(dorsalFinGeo, carbonFiberMat);
    dorsalFinL.position.set(-0.4, 0.72, -1.2);
    const dorsalFinR = new THREE.Mesh(dorsalFinGeo, carbonFiberMat);
    dorsalFinR.position.set(0.4, 0.72, -1.2);
    carGroup.add(dorsalFinL, dorsalFinR);

    // 7. PROMINENT FIXED CARBON FIBER REAR WING (SF90 XX STRADALE ICONIC FEATURE)
    const wingGroup = new THREE.Group();
    wingGroup.name = 'XX_Rear_Wing';

    // Main Airfoil Blade (1.75m width)
    const airfoilGeo = new THREE.BoxGeometry(1.78, 0.06, 0.4);
    const airfoil = new THREE.Mesh(airfoilGeo, carbonFiberMat);
    airfoil.position.set(0, 1.15, -2.05);
    airfoil.rotation.x = 0.08; // Downforce angle of attack
    airfoil.castShadow = true;
    wingGroup.add(airfoil);

    // Dual Twin Carbon Support Pylons / Stanchions
    const pylonGeo = new THREE.BoxGeometry(0.05, 0.55, 0.22);
    pylonGeo.rotateX(-0.2);
    const pylonL = new THREE.Mesh(pylonGeo, carbonFiberMat);
    pylonL.position.set(-0.45, 0.88, -1.95);
    const pylonR = new THREE.Mesh(pylonGeo, carbonFiberMat);
    pylonR.position.set(0.45, 0.88, -1.95);
    wingGroup.add(pylonL, pylonR);

    // Aerodynamic Wing Endplates (With Flash Orange / Accent Trim)
    const endplateGeo = new THREE.BoxGeometry(0.04, 0.32, 0.52);
    const endplateL = new THREE.Mesh(endplateGeo, carbonFiberMat);
    endplateL.position.set(-0.9, 1.18, -2.05);

    const endplateStripeL = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.06, 0.53), accentMat);
    endplateStripeL.position.set(-0.9, 1.18, -2.05);
    endplateL.add(endplateStripeL);

    const endplateR = new THREE.Mesh(endplateGeo, carbonFiberMat);
    endplateR.position.set(0.9, 1.18, -2.05);

    const endplateStripeR = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.06, 0.53), accentMat);
    endplateStripeR.position.set(0.9, 1.18, -2.05);
    endplateR.add(endplateStripeR);

    wingGroup.add(endplateL, endplateR);
    carGroup.add(wingGroup);

    // 8. DUAL-DECK REAR DIFFUSER & HIGH-MOUNTED TITANIUM EXHAUSTS
    const diffuserGeo = new THREE.BoxGeometry(1.9, 0.32, 0.65);
    const diffuser = new THREE.Mesh(diffuserGeo, carbonFiberMat);
    diffuser.position.set(0, 0.22, -2.12);
    carGroup.add(diffuser);

    // Vertical Aero Strakes
    for (let i = -0.65; i <= 0.65; i += 0.43) {
      const strakeGeo = new THREE.BoxGeometry(0.04, 0.24, 0.45);
      const strake = new THREE.Mesh(strakeGeo, carbonFiberMat);
      strake.position.set(i, 0.15, -2.18);
      carGroup.add(strake);
    }

    // High-Mounted Central Titanium Exhausts
    const exhaustGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.28, 24);
    exhaustGeo.rotateX(Math.PI / 2);
    const exhaustMat = new THREE.MeshStandardMaterial({
      color: 0x425570,
      metalness: 0.95,
      roughness: 0.2,
    });
    const exhaustL = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaustL.position.set(-0.16, 0.52, -2.28);
    const exhaustR = new THREE.Mesh(exhaustGeo, exhaustMat);
    exhaustR.position.set(0.16, 0.52, -2.28);
    carGroup.add(exhaustL, exhaustR);

    // Extra Boost Exhaust Flames (Active on Extra Boost)
    const flameGeo = new THREE.ConeGeometry(0.08, 0.45, 16);
    flameGeo.rotateX(-Math.PI / 2);
    const flameMat = new THREE.MeshBasicMaterial({
      color: 0x00d0ff,
      transparent: true,
      opacity: 0.85,
    });
    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(-0.16, 0.52, -2.6);
    flameL.visible = false;
    const flameR = new THREE.Mesh(flameGeo, flameMat);
    flameR.position.set(0.16, 0.52, -2.6);
    flameR.visible = false;

    exhaustFlamesRef.current = [flameL, flameR];
    carGroup.add(flameL, flameR);

    // 9. LIGHTS (HEADLIGHTS & TAILLIGHTS)
    const headlightGeo = new THREE.BoxGeometry(0.35, 0.05, 0.15);
    const headlightL = new THREE.Mesh(headlightGeo, headlightEmissive);
    headlightL.position.set(-0.68, 0.42, 2.05);
    headlightL.rotation.y = -0.25;
    const headlightR = new THREE.Mesh(headlightGeo, headlightEmissive);
    headlightR.position.set(0.68, 0.42, 2.05);
    headlightR.rotation.y = 0.25;
    carGroup.add(headlightL, headlightR);

    const taillightGeo = new THREE.BoxGeometry(0.25, 0.07, 0.05);
    const tailL1 = new THREE.Mesh(taillightGeo, taillightEmissive);
    tailL1.position.set(-0.55, 0.56, -2.24);
    const tailL2 = new THREE.Mesh(taillightGeo, taillightEmissive);
    tailL2.position.set(-0.25, 0.56, -2.24);

    const tailR1 = new THREE.Mesh(taillightGeo, taillightEmissive);
    tailR1.position.set(0.25, 0.56, -2.24);
    const tailR2 = new THREE.Mesh(taillightGeo, taillightEmissive);
    tailR2.position.set(0.55, 0.56, -2.24);
    carGroup.add(tailL1, tailL2, tailR1, tailR2);

    // 10. 20" DIAMOND-CUT FORGED WHEELS WITH BREMBO CALIPERS
    const wheelPositions: [number, number, number][] = [
      [-0.96, 0.36, 1.35],
      [0.96, 0.36, 1.35],
      [-0.98, 0.38, -1.25],
      [0.98, 0.38, -1.25],
    ];

    wheelPositions.forEach(([x, y, z]) => {
      const wheelAssembly = new THREE.Group();
      wheelAssembly.position.set(x, y, z);

      const tireGeo = new THREE.TorusGeometry(0.34, 0.12, 20, 48);
      tireGeo.rotateY(Math.PI / 2);
      const tireMat = new THREE.MeshStandardMaterial({
        color: 0x161619,
        roughness: 0.85,
        metalness: 0.1,
      });
      const tire = new THREE.Mesh(tireGeo, tireMat);
      tire.castShadow = true;
      wheelAssembly.add(tire);

      const rimHubGeo = new THREE.CylinderGeometry(0.26, 0.26, 0.18, 32);
      rimHubGeo.rotateZ(Math.PI / 2);
      const rim = new THREE.Mesh(rimHubGeo, chromeMat);
      wheelAssembly.add(rim);

      const capGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.2, 16);
      capGeo.rotateZ(Math.PI / 2);
      const centerCap = new THREE.Mesh(capGeo, yellowShieldMat);
      wheelAssembly.add(centerCap);

      const discGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.04, 24);
      discGeo.rotateZ(Math.PI / 2);
      const disc = new THREE.Mesh(discGeo, brakeRotorMat);
      wheelAssembly.add(disc);

      const caliperGeo = new THREE.BoxGeometry(0.06, 0.14, 0.1);
      const caliper = new THREE.Mesh(caliperGeo, redCaliperMat);
      caliper.position.set(0, 0.12, 0.08);
      wheelAssembly.add(caliper);

      carGroup.add(wheelAssembly);
    });

    scene.add(carGroup);
    return carGroup;
  };

  // Three.js Render Lifecycle Effect
  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(isNightMode ? 0x060608 : 0x0d0d12);
    scene.fog = new THREE.FogExp2(isNightMode ? 0x060608 : 0x0d0d12, 0.038);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      100,
    );
    camera.position.set(...CAMERA_PRESETS[0].pos);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    containerRef.current.innerHTML = '';
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, isNightMode ? 0.35 : 0.9);
    scene.add(ambientLight);

    const overheadLight = new THREE.DirectionalLight(0xfff5ea, isNightMode ? 1.0 : 2.4);
    overheadLight.position.set(3, 8, 4);
    overheadLight.castShadow = true;
    overheadLight.shadow.mapSize.width = 2048;
    overheadLight.shadow.mapSize.height = 2048;
    overheadLight.shadow.bias = -0.0001;
    scene.add(overheadLight);

    const rimLight = new THREE.DirectionalLight(0x90b8ff, isNightMode ? 0.9 : 1.5);
    rimLight.position.set(-6, 4, -5);
    scene.add(rimLight);

    const warmLight = new THREE.DirectionalLight(0xff9933, 0.85);
    warmLight.position.set(6, 2, -2);
    scene.add(warmLight);

    // Underglow Neon Red Light
    const underglow = new THREE.PointLight(0xe10600, isNightMode ? 4.8 : 1.4, 5.5);
    underglow.position.set(0, 0.15, 0);
    scene.add(underglow);

    // Ground reflection grid
    const groundGeo = new THREE.PlaneGeometry(60, 60);
    const groundMat = new THREE.MeshStandardMaterial({
      color: isNightMode ? 0x08080c : 0x121217,
      roughness: 0.16,
      metalness: 0.88,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    const gridHelper = new THREE.GridHelper(30, 30, 0xe10600, 0x22222d);
    gridHelper.position.y = 0.005;
    scene.add(gridHelper);

    // Build the SF90 XX Stradale model
    buildFerrariSF90XX(scene);

    // Interactive mouse rotation tracking
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = 0.8;
    let sphericalPhi = 1.22;
    let sphericalRadius = 6.4;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
      setIsAutoRotate(false);
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - prevMouseX;
      const deltaY = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= deltaX * 0.008;
      sphericalPhi = Math.max(0.2, Math.min(Math.PI / 2 - 0.05, sphericalPhi - deltaY * 0.008));

      targetCamPosRef.current.x = targetLookAtRef.current.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCamPosRef.current.y = targetLookAtRef.current.y + sphericalRadius * Math.cos(sphericalPhi);
      targetCamPosRef.current.z = targetLookAtRef.current.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      sphericalRadius = Math.max(2.4, Math.min(12.0, sphericalRadius + e.deltaY * 0.005));
      targetCamPosRef.current.x = targetLookAtRef.current.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      targetCamPosRef.current.y = targetLookAtRef.current.y + sphericalRadius * Math.cos(sphericalPhi);
      targetCamPosRef.current.z = targetLookAtRef.current.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    };

    const domElem = renderer.domElement;
    domElem.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    domElem.addEventListener('wheel', onWheel, { passive: false });

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      camera.position.lerp(targetCamPosRef.current, delta * 4.5);
      currentLookAtRef.current.lerp(targetLookAtRef.current, delta * 4.5);
      camera.lookAt(currentLookAtRef.current);

      if (isAutoRotate && !isDragging) {
        sphericalTheta += delta * 0.22;
        targetCamPosRef.current.x = targetLookAtRef.current.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
        targetCamPosRef.current.z = targetLookAtRef.current.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
      }

      // Update hotspot 2D positions
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const positions: Record<string, { x: number; y: number }> = {};

        HOTSPOTS.forEach((spot) => {
          const v = spot.worldPos.clone();
          v.project(camera);
          if (v.z < 1.0) {
            const x = (v.x * 0.5 + 0.5) * rect.width;
            const y = (-(v.y * 0.5) + 0.5) * rect.height;
            positions[spot.id] = { x, y };
          }
        });
        setHotspotScreenPositions(positions);
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      domElem.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      domElem.removeEventListener('wheel', onWheel);
      renderer.dispose();
    };
  }, [isNightMode]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '720px', overflow: 'hidden', background: '#0a0a0c' }}>
      {/* View Mode Toggle: 3D Interactive WebGL vs Official 4K Track Photography */}
      <div
        style={{
          position: 'absolute',
          top: '20px',
          left: '24px',
          display: 'flex',
          background: 'rgba(15, 15, 20, 0.88)',
          backdropFilter: 'blur(16px)',
          padding: '4px',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          zIndex: 20,
        }}
      >
        <button
          onClick={() => setViewMode('3d')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: viewMode === '3d' ? '#E10600' : 'transparent',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <Box size={16} />
          Interactive 3D XX
        </button>
        <button
          onClick={() => setViewMode('gallery')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: viewMode === 'gallery' ? '#E10600' : 'transparent',
            color: '#fff',
            fontSize: '0.85rem',
            fontWeight: '700',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          <ImageIcon size={16} />
          Track Photos ({REFERENCE_PHOTOS.length})
        </button>
      </div>

      {viewMode === '3d' ? (
        <>
          {/* 3D WebGL Canvas */}
          <div ref={containerRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />

          {/* 3D Screen Hotspots */}
          {HOTSPOTS.map((spot) => {
            const pos = hotspotScreenPositions[spot.id];
            if (!pos) return null;
            const isSelected = activeHotspot?.id === spot.id;

            return (
              <div
                key={spot.id}
                style={{
                  position: 'absolute',
                  left: `${pos.x}px`,
                  top: `${pos.y}px`,
                  transform: 'translate(-50%, -50%)',
                  pointerEvents: 'auto',
                  zIndex: 10,
                }}
              >
                <button
                  onClick={() => setActiveHotspot(isSelected ? null : spot)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isSelected ? '#FF5500' : 'rgba(20, 20, 25, 0.85)',
                    border: '2px solid #FF5500',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: isSelected ? '0 0 20px #FF5500' : '0 0 12px rgba(255, 85, 0, 0.5)',
                    transition: 'all 0.2s ease',
                  }}
                  title={spot.title}
                >
                  <Info size={14} />
                </button>

                {isSelected && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '36px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: '290px',
                      background: 'rgba(15, 15, 22, 0.96)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255, 85, 0, 0.6)',
                      borderRadius: '12px',
                      padding: '16px',
                      boxShadow: '0 16px 36px rgba(0,0,0,0.85), 0 0 20px rgba(255,85,0,0.3)',
                      color: '#fff',
                      zIndex: 25,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#FF5500', fontWeight: '800', textTransform: 'uppercase' }}>
                        SF90 XX Telemetry
                      </span>
                      <button
                        onClick={() => setActiveHotspot(null)}
                        style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1rem' }}
                      >
                        ✕
                      </button>
                    </div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '4px' }}>{spot.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: '#FFD700', fontWeight: '700', marginBottom: '8px' }}>
                      {spot.spec}
                    </div>
                    <p style={{ fontSize: '0.8rem', color: '#b0b0b8', lineHeight: '1.4' }}>{spot.description}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Top Camera Presets Bar */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              background: 'rgba(15, 15, 20, 0.85)',
              backdropFilter: 'blur(16px)',
              padding: '6px 12px',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              zIndex: 10,
            }}
          >
            {CAMERA_PRESETS.map((preset) => {
              const isActive = activePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => handlePresetChange(preset)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '9999px',
                    background: isActive ? '#E10600' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#A0A0B0',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    fontWeight: '700',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {preset.name}
                </button>
              );
            })}
          </div>

          {/* Bottom Floating Control Deck */}
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              right: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '16px',
              pointerEvents: 'none',
              zIndex: 10,
            }}
          >
            {/* Livery Studio */}
            <div
              style={{
                background: 'rgba(18, 18, 24, 0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '12px 18px',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                pointerEvents: 'auto',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  XX Livery Studio
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: '700', color: '#fff' }}>{activeColor.name}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {FERRARI_XX_COLORS.map((c) => {
                  const isSelected = activeColor.name === c.name;
                  return (
                    <button
                      key={c.name}
                      onClick={() => handleColorChange(c)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        background: c.hex,
                        border: isSelected ? '3px solid #FFFFFF' : '2px solid rgba(255,255,255,0.2)',
                        boxShadow: isSelected ? '0 0 12px rgba(255,255,255,0.8)' : 'none',
                        cursor: 'pointer',
                        transform: isSelected ? 'scale(1.15)' : 'scale(1)',
                        transition: 'all 0.2s ease',
                      }}
                      title={c.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Right Tools: Extra Boost, Rev, Night Mode */}
            <div
              style={{
                background: 'rgba(18, 18, 24, 0.88)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '16px',
                padding: '10px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                pointerEvents: 'auto',
              }}
            >
              {/* Extra Boost F1 Button */}
              <button
                onClick={toggleExtraBoost}
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: isExtraBoost
                    ? 'linear-gradient(135deg, #00B4D8 0%, #0077B6 100%)'
                    : 'rgba(255,255,255,0.06)',
                  color: isExtraBoost ? '#fff' : '#00B4D8',
                  border: isExtraBoost ? '1px solid #90E0EF' : '1px solid rgba(0, 180, 216, 0.4)',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: isExtraBoost ? '0 0 20px #00B4D8' : 'none',
                  transition: 'all 0.2s ease',
                }}
                title="Toggle Formula 1 Extra Boost (1,030 CV Mode)"
              >
                <Zap size={14} />
                {isExtraBoost ? 'EXTRA BOOST: 1,030 CV' : 'EXTRA BOOST'}
              </button>

              <button
                onClick={() => setIsNightMode(!isNightMode)}
                className="btn-icon"
                title={isNightMode ? 'Switch to Studio Day' : 'Switch to Night Track Mode'}
              >
                {isNightMode ? <Sun size={18} color="#FFD700" /> : <Moon size={18} />}
              </button>

              <button
                onClick={() => setIsAutoRotate(!isAutoRotate)}
                className="btn-icon"
                style={{ borderColor: isAutoRotate ? '#E10600' : 'rgba(255,255,255,0.1)' }}
                title="Toggle 360° Turntable"
              >
                <RotateCcw size={18} color={isAutoRotate ? '#E10600' : '#fff'} />
              </button>

              <button
                onClick={toggleSound}
                className="btn-icon"
                style={{
                  borderColor: isSoundOn ? '#E10600' : 'rgba(255,255,255,0.1)',
                  background: isSoundOn ? 'rgba(225, 6, 0, 0.2)' : 'rgba(255,255,255,0.06)',
                }}
                title="Toggle V8 Hybrid Engine Audio"
              >
                {isSoundOn ? <Volume2 size={18} color="#E10600" /> : <VolumeX size={18} />}
              </button>

              {isSoundOn && (
                <button
                  onMouseDown={() => triggerRev(true)}
                  onMouseUp={() => triggerRev(false)}
                  onMouseLeave={() => triggerRev(false)}
                  onTouchStart={() => triggerRev(true)}
                  onTouchEnd={() => triggerRev(false)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    background: isRevving
                      ? 'linear-gradient(135deg, #FF0000 0%, #B30000 100%)'
                      : 'linear-gradient(135deg, #E10600 0%, #8A0000 100%)',
                    color: '#fff',
                    border: '1px solid #ff4d47',
                    cursor: 'pointer',
                    fontWeight: '800',
                    fontSize: '0.85rem',
                    boxShadow: isRevving ? '0 0 25px #E10600' : '0 4px 12px rgba(225,6,0,0.3)',
                    transform: isRevving ? 'scale(0.96)' : 'scale(1)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isRevving ? '8,500 RPM!' : 'PRESS TO REV'}
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        /* Track Photography High-Res Gallery */
        <div style={{ position: 'relative', width: '100%', height: '100%', background: '#0a0a0c' }}>
          <img
            src={REFERENCE_PHOTOS[currentPhotoIdx].url}
            alt={REFERENCE_PHOTOS[currentPhotoIdx].title}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          />

          {/* Photo Information Banner */}
          <div
            style={{
              position: 'absolute',
              bottom: '90px',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'rgba(12, 12, 16, 0.85)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(225, 6, 0, 0.4)',
              borderRadius: '12px',
              padding: '12px 24px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#fff' }}>
              {REFERENCE_PHOTOS[currentPhotoIdx].title}
            </h3>
            <p style={{ color: '#aaa', fontSize: '0.85rem', marginTop: '2px' }}>
              {REFERENCE_PHOTOS[currentPhotoIdx].subtitle}
            </p>
          </div>

          {/* Carousel Arrows */}
          <button
            onClick={() => setCurrentPhotoIdx((prev) => (prev > 0 ? prev - 1 : REFERENCE_PHOTOS.length - 1))}
            style={{
              position: 'absolute',
              left: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(15, 15, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={() => setCurrentPhotoIdx((prev) => (prev < REFERENCE_PHOTOS.length - 1 ? prev + 1 : 0))}
            style={{
              position: 'absolute',
              right: '24px',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(15, 15, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChevronRight size={24} />
          </button>

          {/* Thumbnail Strip */}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              gap: '8px',
              overflowX: 'auto',
              maxWidth: '80%',
              padding: '6px',
              background: 'rgba(0,0,0,0.6)',
              borderRadius: '10px',
            }}
          >
            {REFERENCE_PHOTOS.map((photo, idx) => (
              <img
                key={idx}
                src={photo.url}
                onClick={() => setCurrentPhotoIdx(idx)}
                style={{
                  width: '60px',
                  height: '40px',
                  objectFit: 'cover',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  border: idx === currentPhotoIdx ? '2px solid #E10600' : '1px solid transparent',
                  opacity: idx === currentPhotoIdx ? 1 : 0.6,
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
