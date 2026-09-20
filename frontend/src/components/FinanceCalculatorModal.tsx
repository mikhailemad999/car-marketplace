import React, { useState } from 'react';
import { X, Calculator, DollarSign, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CarListing } from './SupercarInventory';

interface FinanceCalculatorModalProps {
  car: CarListing | null;
  onClose: () => void;
}

export const FinanceCalculatorModal: React.FC<FinanceCalculatorModalProps> = ({ car, onClose }) => {
  const defaultPrice = car ? Number(car.price) : 980000;
  const [vehiclePrice, setVehiclePrice] = useState<number>(defaultPrice);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [termMonths, setTermMonths] = useState<number>(48);
  const [interestRate, setInterestRate] = useState<number>(5.9);

  const downPaymentAmount = (vehiclePrice * downPaymentPercent) / 100;
  const loanAmount = vehiclePrice - downPaymentAmount;

  // Monthly loan payment formula: M = P [ i(1 + i)^n ] / [ (1 + i)^n – 1]
  const monthlyRate = interestRate / 100 / 12;
  const monthlyPayment =
    (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, termMonths))) /
    (Math.pow(1 + monthlyRate, termMonths) - 1);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(5, 5, 8, 0.9)',
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
          maxWidth: '650px',
          background: '#0e0e14',
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

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'rgba(225, 6, 0, 0.15)',
              border: '1px solid #E10600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#E10600',
            }}
          >
            <Calculator size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: '900', color: '#fff' }}>Ferrari Financial Services</h2>
            <div style={{ fontSize: '0.8rem', color: '#888' }}>
              Custom tailored leasing & bespoke acquisition schedules
            </div>
          </div>
        </div>

        {/* Selected Vehicle Banner */}
        {car && (
          <div
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.06)',
              marginBottom: '24px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: '700' }}>{car.year} {car.model}</div>
              <div style={{ fontWeight: '800', fontSize: '1rem', color: '#fff' }}>{car.title}</div>
            </div>
            <div className="mono" style={{ fontSize: '1.2rem', fontWeight: '900', color: '#E10600' }}>
              ${vehiclePrice.toLocaleString()}
            </div>
          </div>
        )}

        {/* Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
          {/* Down payment */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#aaa' }}>Down Payment ({downPaymentPercent}%)</span>
              <span className="mono" style={{ fontWeight: '700', color: '#fff' }}>
                ${downPaymentAmount.toLocaleString()}
              </span>
            </div>
            <input
              type="range"
              min={10}
              max={60}
              step={5}
              value={downPaymentPercent}
              onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#E10600', cursor: 'pointer' }}
            />
          </div>

          {/* Term Months */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '8px' }}>
              <span style={{ color: '#aaa' }}>Financing Term</span>
              <span className="mono" style={{ fontWeight: '700', color: '#fff' }}>{termMonths} Months</span>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[24, 36, 48, 60].map((term) => (
                <button
                  key={term}
                  onClick={() => setTermMonths(term)}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: termMonths === term ? '1px solid #E10600' : '1px solid rgba(255,255,255,0.1)',
                    background: termMonths === term ? 'rgba(225, 6, 0, 0.2)' : 'rgba(255,255,255,0.04)',
                    color: termMonths === term ? '#FF4A45' : '#aaa',
                    fontWeight: '700',
                    cursor: 'pointer',
                  }}
                >
                  {term} Mo
                </button>
              ))}
            </div>
          </div>

          {/* Estimated APR */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '6px' }}>
              <span style={{ color: '#aaa' }}>Preferred APR Rate</span>
              <span className="mono" style={{ fontWeight: '700', color: '#00D084' }}>{interestRate}% Fixed</span>
            </div>
            <input
              type="range"
              min={3.9}
              max={9.9}
              step={0.1}
              value={interestRate}
              onChange={(e) => setInterestRate(Number(e.target.value))}
              style={{ width: '100%', accentColor: '#00D084', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* Estimated Monthly Payment Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(225, 6, 0, 0.15) 0%, rgba(20, 20, 26, 0.9) 100%)',
            border: '1px solid rgba(225, 6, 0, 0.4)',
            borderRadius: '16px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          <div style={{ fontSize: '0.8rem', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Estimated Monthly Investment
          </div>
          <div className="mono" style={{ fontSize: '2.5rem', fontWeight: '900', color: '#fff', margin: '6px 0' }}>
            ${Math.round(monthlyPayment).toLocaleString()} <span style={{ fontSize: '1rem', color: '#aaa' }}>/mo</span>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#00D084' }}>
            ✓ Includes Ferrari 7-Year Genuine Maintenance Program
          </div>
        </div>

        <button onClick={onClose} className="btn btn-primary" style={{ width: '100%', padding: '14px' }}>
          Apply for Maranello Financial Pre-Approval
        </button>
      </div>
    </div>
  );
};
