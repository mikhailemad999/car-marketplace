import React, { useState } from 'react';
import { CarListing } from './SupercarInventory';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Gauge,
  Flame,
  Compass,
  Calendar,
  DollarSign,
  Phone,
  MessageCircle,
  FileCheck,
  MapPin,
  Award,
  Clock,
  Key,
  Copy,
  Check,
  HelpCircle,
  Car,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface CarDetailModalProps {
  car: CarListing | null;
  currentUser: any;
  onClose: () => void;
  onRequireAuth: () => void;
  onPaymentSuccess: () => void;
}

export const CarDetailModal: React.FC<CarDetailModalProps> = ({
  car,
  currentUser,
  onClose,
  onRequireAuth,
  onPaymentSuccess,
}) => {
  const [bookingType, setBookingType] = useState<'deposit' | 'test_drive' | 'contact'>('deposit');
  const [depositAmount, setDepositAmount] = useState<number>(25000);
  const [testDriveDate, setTestDriveDate] = useState<string>('2026-10-15');
  const [testDriveLocation, setTestDriveLocation] = useState<string>('Pista di Fiorano, Maranello, Italy');
  const [contactMessage, setContactMessage] = useState<string>('I would like to arrange private inspection & delivery logistics.');
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedVin, setCopiedVin] = useState<boolean>(false);
  const [copiedCert, setCopiedCert] = useState<boolean>(false);

  if (!car) return null;

  const handleDepositPurchase = async () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('ferrari_token');
      const res = await fetch('http://localhost:4000/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          listingId: car.id,
          amount: depositAmount,
          notes: `Reservation escrow deposit for ${car.title}. Buyer: ${currentUser.name} (${currentUser.email}, Phone: ${currentUser.phone || 'N/A'})`,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Payment failed');
      }

      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#E10600', '#FFD700', '#FFFFFF'],
      });

      setSuccessMessage(`Reservation Confirmed! Reference deposit of $${depositAmount.toLocaleString()} has been secured in escrow under Ferrari dealer protocol for ${car.title}.`);
      onPaymentSuccess();
    } catch (err: any) {
      alert('Transaction Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleBookTestDrive = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E10600', '#FFFFFF', '#FFD700'],
    });

    setSuccessMessage(`Test Drive Requested! Our Maranello Concierge has received your request for ${car.title} at ${testDriveLocation} on ${testDriveDate}. We will contact you at ${currentUser.email}.`);
  };

  const handleSendMessage = () => {
    if (!currentUser) {
      onRequireAuth();
      return;
    }

    setSuccessMessage(`Inquiry Transmitted! Direct message sent to ${car.seller?.name || 'Maranello Exclusive Motors'} regarding chassis ${car.vin || car.specs?.vin || 'VIN'}.`);
  };

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  const copyToClipboard = (text: string, type: 'vin' | 'cert') => {
    navigator.clipboard.writeText(text);
    if (type === 'vin') {
      setCopiedVin(true);
      setTimeout(() => setCopiedVin(false), 2000);
    } else {
      setCopiedCert(true);
      setTimeout(() => setCopiedCert(false), 2000);
    }
  };

  const mainImg = car.images && car.images[0] ? car.images[0].url : '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg';
  const miles = car.mileage !== undefined ? car.mileage : (car.specs?.mileage || 150);
  const km = Math.round(miles * 1.60934);
  const vin = car.vin || car.specs?.vin || 'ZFF90XXST000042';
  const certNumber = car.certificateNumber || `FER-APP-2024-${String(car.id).padStart(3, '0')}`;
  const sellerPhone = car.sellerPhone || car.seller?.phone || '+39 0536 949111';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.88)',
        backdropFilter: 'blur(14px)',
        zIndex: 200,
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
          maxWidth: '1080px',
          maxHeight: '94vh',
          overflowY: 'auto',
          background: '#0B0B0F',
          border: '1px solid rgba(225, 6, 0, 0.4)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.95), 0 0 35px rgba(225,6,0,0.25)',
          borderRadius: '20px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.12)',
            border: 'none',
            borderRadius: '50%',
            width: '38px',
            height: '38px',
            color: '#fff',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.2s',
          }}
        >
          <X size={20} />
        </button>

        {/* Hero Image Stage */}
        <div style={{ position: 'relative', height: '360px', width: '100%', overflow: 'hidden' }}>
          <img
            src={mainImg}
            alt={car.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 50%' }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background:
                'linear-gradient(to top, #0B0B0F 0%, rgba(11,11,15,0.4) 50%, rgba(0,0,0,0.7) 100%)',
            }}
          />

          {/* Badges Over Image */}
          <div style={{ position: 'absolute', bottom: '24px', left: '32px', right: '32px' }}>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
              <span className="badge-ferrari">{car.year} SPECIFICATION</span>
              <span className="badge-yellow">{car.color}</span>
              <span
                style={{
                  background: 'rgba(0, 208, 132, 0.2)',
                  border: '1px solid #00D084',
                  color: '#00D084',
                  fontSize: '0.75rem',
                  fontWeight: '800',
                  padding: '3px 10px',
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={14} />
                MARANELLO CERTIFIED
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: '900', color: '#fff', lineHeight: 1.1, margin: 0 }}>
              {car.title}
            </h2>
          </div>
        </div>

        {/* Modal Main Body */}
        <div style={{ padding: '32px' }}>
          {successMessage ? (
            <div
              style={{
                background: 'rgba(0, 208, 132, 0.12)',
                border: '1px solid #00D084',
                borderRadius: '16px',
                padding: '36px',
                textAlign: 'center',
                color: '#fff',
                marginBottom: '24px',
              }}
            >
              <CheckCircle2 size={56} color="#00D084" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '10px' }}>Transaction Confirmed</h3>
              <p style={{ color: '#c5e8d8', fontSize: '1rem', maxWidth: '600px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                {successMessage}
              </p>
              <button onClick={onClose} className="btn btn-primary">
                Return to Supercar Inventory
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1.35fr 1fr', gap: '32px' }}>
              {/* Left Column: Dossier, Odometer, Specs & Certificate */}
              <div>
                {/* 1. Odometer & Chassis Header Strip */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 215, 0, 0.3)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '24px',
                  }}
                >
                  {/* Verified Mileage */}
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#FFD700', fontWeight: '800', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Gauge size={14} /> Verified Odometer
                    </div>
                    <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '900', color: '#FFF' }}>
                      {miles.toLocaleString()} <span style={{ fontSize: '0.85rem', color: '#FFD700' }}>MILES</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8E8E9F' }}>
                      ≈ {km.toLocaleString()} Kilometers (Factory Authenticated)
                    </div>
                  </div>

                  {/* Chassis VIN */}
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', fontWeight: '700', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                      <Key size={14} /> Chassis / VIN
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="mono" style={{ fontSize: '1.05rem', fontWeight: '800', color: '#FFF' }}>
                        {vin}
                      </span>
                      <button
                        onClick={() => copyToClipboard(vin, 'vin')}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: copiedVin ? '#00D084' : '#888',
                          cursor: 'pointer',
                          padding: '2px',
                        }}
                        title="Copy VIN"
                      >
                        {copiedVin ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#8E8E9F' }}>
                      Maranello Engine Match Confirmed
                    </div>
                  </div>
                </div>

                {/* 2. Official Ferrari Certificate of Authenticity & 101-Point Inspection */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.08) 0%, rgba(18, 18, 24, 0.85) 100%)',
                    border: '1px solid rgba(255, 215, 0, 0.5)',
                    borderRadius: '14px',
                    padding: '18px 20px',
                    marginBottom: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '50%',
                          background: 'rgba(255, 215, 0, 0.2)',
                          border: '1px solid #FFD700',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#FFD700',
                        }}
                      >
                        <Award size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.88rem', fontWeight: '900', color: '#FFD700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {car.certificationType || 'Ferrari Approved 101-Point Technical Inspection'}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#BBB' }}>
                          Issued at Maranello Proving Ground · Inspection Date: {car.inspectionDate || '2024-08-18'}
                        </div>
                      </div>
                    </div>

                    {/* Certificate Badge */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: 'rgba(0,0,0,0.6)',
                        border: '1px solid #FFD700',
                        padding: '4px 10px',
                        borderRadius: '6px',
                      }}
                    >
                      <FileCheck size={14} color="#FFD700" />
                      <span className="mono" style={{ fontSize: '0.8rem', fontWeight: '800', color: '#FFF' }}>
                        {certNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(certNumber, 'cert')}
                        style={{ background: 'none', border: 'none', color: copiedCert ? '#00D084' : '#888', cursor: 'pointer', padding: 0 }}
                        title="Copy Certificate Number"
                      >
                        {copiedCert ? <Check size={12} /> : <Copy size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* 101-Point Checkpoints Grid */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '8px',
                      fontSize: '0.76rem',
                      color: '#D0D0E0',
                      background: 'rgba(0,0,0,0.3)',
                      padding: '12px',
                      borderRadius: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#00D084" />
                      <span>Powertrain & 1,030 CV Hybrid System (100%)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#00D084" />
                      <span>Brembo Carbon-Ceramic Disc Thickness: Nominal</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#00D084" />
                      <span>Laser Chassis Geometry & Frame Alignment Pass</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={13} color="#00D084" />
                      <span>Factory Original Paint Depth & Weave Verified</span>
                    </div>
                  </div>

                  {/* Inspector Notes */}
                  <div style={{ fontSize: '0.75rem', color: '#AAA', fontStyle: 'italic' }}>
                    &ldquo;{car.inspectorNotes || '101-Point comprehensive Maranello mechanical & cosmetic inspection passed. Certified clean history, zero structural damage, verified original paint depth and matching numbers.'}&rdquo;
                  </div>
                </div>

                {/* 3. Description & Specs */}
                <h3 style={{ fontSize: '1.15rem', fontWeight: '800', marginBottom: '10px', color: '#E10600' }}>
                  Mechanical Specifications
                </h3>
                <p style={{ color: '#B0B0C0', lineHeight: 1.5, marginBottom: '20px', fontSize: '0.92rem' }}>
                  {car.description}
                </p>

                {/* Specs Grid */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '12px',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.06)',
                    borderRadius: '12px',
                    padding: '16px',
                    marginBottom: '20px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Combustion Engine</div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
                      {car.specs?.engine || '4.0L Twin-Turbo 90° V8'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Total Horsepower</div>
                    <div className="mono" style={{ fontWeight: '800', color: '#E10600', fontSize: '1.05rem' }}>
                      {car.specs?.horsepower || 1000} CV
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Acceleration (0-100 km/h)</div>
                    <div className="mono" style={{ fontWeight: '800', color: '#fff', fontSize: '1.05rem' }}>
                      {car.specs?.acceleration || '2.3 seconds'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Top Speed</div>
                    <div className="mono" style={{ fontWeight: '800', color: '#fff', fontSize: '1.05rem' }}>
                      {car.specs?.topSpeed || '320 km/h'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Transmission</div>
                    <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.9rem' }}>
                      {car.specs?.transmission || '8-Speed F1 Dual-Clutch'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Hybrid Architecture</div>
                    <div style={{ fontWeight: '700', color: '#FFD700', fontSize: '0.85rem' }}>
                      {car.specs?.hybridSystem || 'PHEV Tri-Motor e-AWD'}
                    </div>
                  </div>
                </div>

                {/* Warranty terms */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#00D084', fontSize: '0.82rem' }}>
                  <ShieldCheck size={18} />
                  <span>{car.warranty || 'Ferrari Power15 Warranty Included (Valid to 2029)'}</span>
                </div>
              </div>

              {/* Right Column: Acquisition, Phone & Dealer Concierge */}
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(225, 6, 0, 0.3)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Official Asking Valuation</span>
                      <div className="mono" style={{ fontSize: '2.1rem', fontWeight: '900', color: '#fff' }}>
                        {formatPrice(car.price)}
                      </div>
                    </div>
                    <span className="badge-yellow" style={{ fontSize: '0.7rem' }}>TAX PAID / EXW</span>
                  </div>

                  {/* Dealer Direct Phone & Location Card */}
                  <div
                    style={{
                      background: 'rgba(0, 208, 132, 0.08)',
                      border: '1px solid rgba(0, 208, 132, 0.3)',
                      borderRadius: '10px',
                      padding: '12px 16px',
                      marginBottom: '20px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <div style={{ fontSize: '0.72rem', color: '#8E8E9F', textTransform: 'uppercase', fontWeight: '700' }}>
                        Direct Dealer Phone
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#00D084', fontWeight: '700' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#00D084', display: 'inline-block' }}></span>
                        Available Now
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <a
                        href={`tel:${sellerPhone}`}
                        style={{
                          fontSize: '1.15rem',
                          fontWeight: '800',
                          color: '#00D084',
                          textDecoration: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          fontFamily: 'monospace',
                        }}
                      >
                        <Phone size={16} />
                        {sellerPhone}
                      </a>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <a
                          href={`tel:${sellerPhone}`}
                          className="btn btn-primary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                        >
                          Call
                        </a>
                        <a
                          href={`https://wa.me/${sellerPhone.replace(/[^0-9]/g, '')}?text=Hello%20Scuderia%20Maranello,%20I%20am%20interested%20in%20the%20${encodeURIComponent(car.title)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.75rem', borderColor: '#25D366', color: '#25D366' }}
                        >
                          WhatsApp
                        </a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#8E8E9F', marginTop: '6px' }}>
                      <MapPin size={12} color="#E10600" />
                      <span>{car.location || 'Maranello Headquarters, Italy'}</span>
                    </div>
                  </div>

                  {/* Booking Selector Tabs */}
                  <div style={{ display: 'flex', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '4px', marginBottom: '18px' }}>
                    <button
                      onClick={() => setBookingType('deposit')}
                      style={{
                        flex: 1,
                        padding: '8px 6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: bookingType === 'deposit' ? '#E10600' : 'transparent',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Reserve Escrow
                    </button>
                    <button
                      onClick={() => setBookingType('test_drive')}
                      style={{
                        flex: 1,
                        padding: '8px 6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: bookingType === 'test_drive' ? '#E10600' : 'transparent',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Track Test Drive
                    </button>
                    <button
                      onClick={() => setBookingType('contact')}
                      style={{
                        flex: 1,
                        padding: '8px 6px',
                        borderRadius: '6px',
                        border: 'none',
                        background: bookingType === 'contact' ? '#E10600' : 'transparent',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                      }}
                    >
                      Inquire Concierge
                    </button>
                  </div>

                  {/* Tab 1: Escrow Deposit */}
                  {bookingType === 'deposit' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>
                        Escrow Deposit Amount (USD)
                      </label>
                      <select
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(Number(e.target.value))}
                        style={{
                          width: '100%',
                          padding: '10px 12px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          marginBottom: '14px',
                          outline: 'none',
                        }}
                      >
                        <option value={10000}>$10,000 (Priority Lock)</option>
                        <option value={25000}>$25,000 (Full Maranello Reservation)</option>
                        <option value={50000}>$50,000 (Escrow Binding Deposit)</option>
                      </select>

                      <p style={{ fontSize: '0.74rem', color: '#888', lineHeight: 1.4, marginBottom: '18px' }}>
                        Secured under Ferrari dealer escrow protocol. Funds recorded directly in MySQL transactions ledger with full buyer refund rights.
                      </p>

                      <button
                        onClick={handleDepositPurchase}
                        disabled={submitting}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px' }}
                      >
                        {submitting ? 'Securing Escrow in MySQL...' : `Place $${depositAmount.toLocaleString()} Escrow Deposit`}
                      </button>
                    </div>
                  )}

                  {/* Tab 2: Test Drive */}
                  {bookingType === 'test_drive' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>
                        Preferred Track Session Date
                      </label>
                      <input
                        type="date"
                        value={testDriveDate}
                        onChange={(e) => setTestDriveDate(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          marginBottom: '12px',
                        }}
                      />

                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>
                        Circuit Location
                      </label>
                      <select
                        value={testDriveLocation}
                        onChange={(e) => setTestDriveLocation(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          marginBottom: '18px',
                        }}
                      >
                        <option value="Pista di Fiorano, Maranello, Italy">Pista di Fiorano (Maranello, Italy)</option>
                        <option value="Autodromo Nazionale Monza, Italy">Autodromo Nazionale Monza</option>
                        <option value="Circuit of the Americas, Austin TX">Circuit of the Americas (USA)</option>
                        <option value="Silverstone Grand Prix Circuit, UK">Silverstone Circuit (UK)</option>
                      </select>

                      <button
                        onClick={handleBookTestDrive}
                        className="btn btn-secondary"
                        style={{ width: '100%', padding: '14px', borderColor: '#FFD700', color: '#FFD700' }}
                      >
                        Schedule Fiorano Track Session
                      </button>
                    </div>
                  )}

                  {/* Tab 3: Direct Inquiry Form */}
                  {bookingType === 'contact' && (
                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>
                        Private Message to Maranello Concierge
                      </label>
                      <textarea
                        rows={4}
                        value={contactMessage}
                        onChange={(e) => setContactMessage(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px',
                          background: 'rgba(255,255,255,0.08)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.15)',
                          borderRadius: '8px',
                          marginBottom: '16px',
                          resize: 'none',
                          fontSize: '0.85rem',
                        }}
                      />

                      <button
                        onClick={handleSendMessage}
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '14px' }}
                      >
                        Transmit Direct Inquiry
                      </button>
                    </div>
                  )}
                </div>

                {/* Seller & Provenance Footer */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', marginTop: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>Certified Seller Partner</div>
                      <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.92rem' }}>
                        {car.seller?.name || 'Maranello Exclusive Motors'}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.72rem', color: '#888' }}>Provenance Rating</div>
                      <div style={{ color: '#FFD700', fontWeight: '800', fontSize: '0.92rem' }}>
                        ★★★★★ 100%
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
