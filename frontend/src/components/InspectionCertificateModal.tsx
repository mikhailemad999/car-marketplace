import React from 'react';
import { X, ShieldCheck, Award, Printer, CheckCircle2, FileCheck, MapPin, Calendar, QrCode } from 'lucide-react';
import { CarListing } from './SupercarInventory';

interface InspectionCertificateModalProps {
  car: CarListing | null;
  onClose: () => void;
}

export const InspectionCertificateModal: React.FC<InspectionCertificateModalProps> = ({
  car,
  onClose,
}) => {
  if (!car) return null;

  const miles = car.mileage !== undefined ? car.mileage : (car.specs?.mileage || 150);
  const km = Math.round(miles * 1.60934);
  const vin = car.vin || car.specs?.vin || 'ZFF90XXST000042';
  const certNumber = car.certificateNumber || `FER-APP-2024-${String(car.id).padStart(3, '0')}`;
  const inspectionDate = car.inspectionDate || '2024-08-20';
  const inspectorNotes = car.inspectorNotes || 'Zero structural anomalies. Fiorano race telemetry parameters calibrated to factory specification. Odometer verified authentic.';

  const handlePrint = () => {
    window.print();
  };

  const inspectionChecklist = [
    { category: 'Powertrain & Hybrid Architecture', items: ['4.0L Twin-Turbo V8 Compression & Valve Timing (Pass)', 'Triple Electric Motors & MGU-K Synchronization (Pass)', '7.9 kWh High-Voltage Li-ion Battery State of Health 99.4% (Pass)', '8-Speed Dual-Clutch Transmission Hydraulic Pressure (Pass)'] },
    { category: 'Chassis, Suspension & Aerodynamics', items: ['Carbon-Fiber Monocoque Rigidity & Integrity Scan (Pass)', 'SCM-Frs Magnetorheological Active Dampers (Pass)', 'Carbon-Ceramic CCM-R Braking Discs & Calipers (Pass)', 'Active Rear Shut-Off Gurney Downforce Actuators (Pass)'] },
    { category: 'Electronics, Telemetry & Safety', items: ['Side Slip Control (eSSC 8.0) Sensor Array (Pass)', 'Maranello Factory Telemetry Data Logging (Pass)', 'Laser Headlamp & Driver Assistance Calibrations (Pass)', 'Odometer ECU Digital Cryptographic Anti-Tamper Check (Pass)'] },
    { category: 'Coachwork, Paint & Tailor Made Finish', items: ['Rosso Corsa / Carbon Finish Depth Analysis: 120 μm (Pass)', 'Dry Carbon-Fiber Weave Symmetry & Clearcoat (Pass)', 'Poltrona Frau Leather & Alcantara Interior Stitching (Pass)', 'Aerodynamic Underbody Venturi Diffusers (Pass)'] },
  ];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(12px)',
        zIndex: 260,
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
          maxWidth: '850px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0D0D12',
          borderRadius: '16px',
          border: '2px solid rgba(255, 215, 0, 0.35)',
          boxShadow: '0 0 60px rgba(225, 6, 0, 0.25)',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Actions bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Award size={22} color="#FFD700" />
            <span style={{ fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0.1em', color: '#FFD700', textTransform: 'uppercase' }}>
              Official Scuderia Certification Document
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handlePrint}
              className="btn btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.82rem', display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <Printer size={15} />
              Print / Save PDF
            </button>
            <button
              onClick={onClose}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#AAA',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Certificate Border Frame */}
        <div
          style={{
            border: '2px solid #C5A059',
            padding: '28px',
            borderRadius: '12px',
            background: 'linear-gradient(180deg, rgba(20, 20, 26, 0.9) 0%, rgba(10, 10, 14, 0.95) 100%)',
            position: 'relative',
          }}
        >
          {/* Certificate Header */}
          <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(197, 160, 89, 0.3)', paddingBottom: '20px', marginBottom: '24px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                background: '#E10600',
                border: '2px solid #FFD700',
                color: '#FFD700',
                fontWeight: '900',
                fontSize: '1.4rem',
                fontStyle: 'italic',
                marginBottom: '12px',
              }}
            >
              SF
            </div>
            <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: '900', letterSpacing: '0.08em', color: '#FFF' }}>
              FERRARI APPROVED 101-POINT CERTIFICATE
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: '0.85rem', color: '#C5A059', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              Scuderia Technical Verification & Factory Authenticity Seal
            </p>
          </div>

          {/* Supercar Details Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '14px',
              background: 'rgba(255, 255, 255, 0.03)',
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              marginBottom: '24px',
            }}
          >
            <div>
              <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Vehicle Identification</span>
              <p style={{ margin: '2px 0 0', fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>{car.title}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Certificate Number</span>
              <p style={{ margin: '2px 0 0', fontWeight: '800', color: '#FFD700', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                {certNumber}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Chassis VIN</span>
              <p style={{ margin: '2px 0 0', fontWeight: '800', color: '#00D084', fontSize: '0.95rem', fontFamily: 'monospace' }}>
                {vin}
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Verified Mileage</span>
              <p style={{ margin: '2px 0 0', fontWeight: '800', color: '#FFF', fontSize: '0.95rem' }}>
                {miles.toLocaleString()} mi ({km.toLocaleString()} km)
              </p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Inspection Date</span>
              <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#CCC', fontSize: '0.9rem' }}>{inspectionDate}</p>
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', color: '#888', textTransform: 'uppercase' }}>Certification Warranty</span>
              <p style={{ margin: '2px 0 0', fontWeight: '700', color: '#E10600', fontSize: '0.9rem' }}>
                {car.warranty || 'Ferrari Power15 Included'}
              </p>
            </div>
          </div>

          {/* 101-Point Inspection Checklist Highlights */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ margin: '0 0 12px', fontSize: '0.95rem', fontWeight: '800', color: '#FFF', letterSpacing: '0.05em' }}>
              101-Point Comprehensive Technical Assessment
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
              {inspectionChecklist.map((sec, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    padding: '12px 14px',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                  }}
                >
                  <p style={{ margin: '0 0 8px', fontSize: '0.8rem', fontWeight: '700', color: '#C5A059' }}>
                    {sec.category}
                  </p>
                  <ul style={{ margin: 0, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {sec.items.map((it, j) => (
                      <li key={j} style={{ fontSize: '0.75rem', color: '#AAA' }}>
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Inspector Notes & Stamp */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '20px',
              padding: '16px',
              background: 'rgba(225, 6, 0, 0.06)',
              borderRadius: '8px',
              border: '1px solid rgba(225, 6, 0, 0.2)',
            }}
          >
            <div style={{ flex: 1, minWidth: '260px' }}>
              <span style={{ fontSize: '0.72rem', color: '#E10600', fontWeight: '700', textTransform: 'uppercase' }}>
                Chief Technical Officer Assessment
              </span>
              <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: '#EEE', fontStyle: 'italic' }}>
                "{inspectorNotes}"
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'cursive', fontSize: '1.2rem', color: '#FFD700', borderBottom: '1px solid #777', paddingBottom: '4px' }}>
                  Matteo Binotto
                </div>
                <span style={{ fontSize: '0.68rem', color: '#888', textTransform: 'uppercase' }}>
                  Lead Scuderia Inspector
                </span>
              </div>

              <div
                style={{
                  width: '68px',
                  height: '68px',
                  borderRadius: '50%',
                  border: '2px dashed #00D084',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00D084',
                  transform: 'rotate(-10deg)',
                }}
              >
                <ShieldCheck size={20} />
                <span style={{ fontSize: '0.55rem', fontWeight: '900', textTransform: 'uppercase', textAlign: 'center' }}>
                  MARANELLO<br />PASSED
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
