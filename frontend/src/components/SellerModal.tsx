import React, { useState, useEffect } from 'react';
import {
  X,
  Plus,
  Sparkles,
  CheckCircle2,
  Phone,
  FileCheck,
  Gauge,
  Key,
  MapPin,
  Car,
  ListOrdered,
  DollarSign,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface SellerModalProps {
  onClose: () => void;
  onListingCreated: () => void;
}

export const SellerModal: React.FC<SellerModalProps> = ({ onClose, onListingCreated }) => {
  const [activeTab, setActiveTab] = useState<'create' | 'my_listings'>('create');
  const [formData, setFormData] = useState({
    title: 'Ferrari SF90 Spider Assetto Fiorano',
    model: 'SF90 Spider',
    color: 'Rosso Corsa / Carbon Roof',
    year: 2024,
    price: 695000,
    engine: '4.0L Twin-Turbo V8 + 3 Electric Motors',
    horsepower: 1000,
    acceleration: '2.5s (0-100 km/h)',
    topSpeed: '340 km/h',
    mileage: 450,
    vin: 'ZFF90SPD004128',
    sellerPhone: '+39 0536 949111',
    certificateNumber: 'FER-APP-2024-088',
    certificationType: 'Ferrari Approved 101-Point Technical Inspection',
    location: 'Maranello Exclusive Motors, Italy',
    warranty: 'Ferrari Power15 Warranty Valid to 2029',
    description: 'Retractable Hard Top SF90 Spider equipped with lightweight Assetto Fiorano package, two-tone livery, and Michelin Pilot Sport Cup 2R tires.',
    imageUrl: '/cars/2024-ferrari-sf90-xx-stradale-103-654a668d31cb4.jpg',
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [myListings, setMyListings] = useState<any[]>([]);
  const [loadingListings, setLoadingListings] = useState(false);

  const fetchMyListings = async () => {
    setLoadingListings(true);
    try {
      const token = localStorage.getItem('ferrari_token');
      const res = await fetch('http://localhost:4000/listings?limit=50');
      if (res.ok) {
        const data = await res.json();
        setMyListings(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingListings(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'my_listings') {
      fetchMyListings();
    }
  }, [activeTab]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const token = localStorage.getItem('ferrari_token');
      const payload = {
        title: formData.title,
        model: formData.model,
        color: formData.color,
        year: Number(formData.year),
        price: Number(formData.price),
        mileage: Number(formData.mileage),
        vin: formData.vin,
        sellerPhone: formData.sellerPhone,
        certificateNumber: formData.certificateNumber,
        certificationType: formData.certificationType,
        location: formData.location,
        warranty: formData.warranty,
        description: formData.description,
        specs: {
          engine: formData.engine,
          horsepower: Number(formData.horsepower),
          acceleration: formData.acceleration,
          topSpeed: formData.topSpeed,
          mileage: Number(formData.mileage),
          vin: formData.vin,
          transmission: '8-Speed F1 Dual-Clutch',
          drivetrain: 'e-4WD',
        },
        images: [{ url: formData.imageUrl, type: 'photo' }],
      };

      const res = await fetch('http://localhost:4000/listings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to list supercar');
      }

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#E10600', '#FFD700'],
      });

      setSuccess(true);
      onListingCreated();
    } catch (err: any) {
      alert('Listing Error: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

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
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0D0D12',
          border: '1px solid rgba(225, 6, 0, 0.4)',
          borderRadius: '20px',
          padding: '32px',
          position: 'relative',
          boxShadow: '0 24px 60px rgba(0,0,0,0.95), 0 0 30px rgba(225,6,0,0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255,255,255,0.08)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: '#888',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <X size={20} />
        </button>

        {/* Header with Title & Tab Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#00D084', fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              <Sparkles size={14} /> Maranello Seller Portal
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', margin: 0 }}>
              Supercar Consignment & Inventory
            </h2>
          </div>

          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px' }}>
            <button
              onClick={() => setActiveTab('create')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'create' ? '#E10600' : 'transparent',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Plus size={14} /> Consign New Vehicle
            </button>
            <button
              onClick={() => setActiveTab('my_listings')}
              style={{
                padding: '8px 16px',
                borderRadius: '6px',
                border: 'none',
                background: activeTab === 'my_listings' ? '#E10600' : 'transparent',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <ListOrdered size={14} /> My Consignments
            </button>
          </div>
        </div>

        {/* TAB 1: Consign New Supercar */}
        {activeTab === 'create' && (
          <div>
            {success ? (
              <div style={{ textAlign: 'center', padding: '48px 0' }}>
                <CheckCircle2 size={56} color="#00D084" style={{ margin: '0 auto 16px' }} />
                <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff', marginBottom: '8px' }}>
                  Supercar Listed in MySQL Database!
                </h3>
                <p style={{ color: '#aaa', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 24px' }}>
                  Your listing is now synchronized in MySQL port 3305 with certified inspection credentials and verified phone routing.
                </p>
                <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                  <button onClick={() => setSuccess(false)} className="btn btn-secondary">
                    List Another Vehicle
                  </button>
                  <button onClick={onClose} className="btn btn-primary">
                    Return to Fleet
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Vehicle Title</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Ferrari Model</label>
                    <input
                      type="text"
                      required
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Asking Price (USD)</label>
                    <input
                      type="number"
                      required
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Model Year</label>
                    <input
                      type="number"
                      required
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  {/* Mileage (Miles) & VIN */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#FFD700', marginBottom: '6px', fontWeight: '700' }}>
                      Exact Mileage (Miles)
                    </label>
                    <input
                      type="number"
                      required
                      value={formData.mileage}
                      onChange={(e) => setFormData({ ...formData, mileage: Number(e.target.value) })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid #FFD700', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#00B4D8', marginBottom: '6px', fontWeight: '700' }}>
                      Chassis VIN (17 Characters)
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.vin}
                      onChange={(e) => setFormData({ ...formData, vin: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid #00B4D8', borderRadius: '8px', color: '#fff', fontFamily: 'monospace' }}
                    />
                  </div>

                  {/* Seller Phone & Certificate Number */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#00D084', marginBottom: '6px', fontWeight: '700' }}>
                      Seller Contact Phone
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.sellerPhone}
                      onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid #00D084', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#E10600', marginBottom: '6px', fontWeight: '700' }}>
                      Maranello Certificate Number
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.certificateNumber}
                      onChange={(e) => setFormData({ ...formData, certificateNumber: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid #E10600', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Exterior Livery Color</label>
                    <input
                      type="text"
                      value={formData.color}
                      onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Dealer Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Vehicle Description & Provenance</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff', resize: 'none' }}
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', fontSize: '0.78rem', color: '#888', marginBottom: '6px' }}>Primary Showcase Image URL</label>
                  <input
                    type="text"
                    value={formData.imageUrl}
                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '8px', color: '#fff' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '1rem' }}
                >
                  {submitting ? 'Submitting to Maranello MySQL...' : 'Commit Supercar Consignment'}
                </button>
              </form>
            )}
          </div>
        )}

        {/* TAB 2: My Consignments */}
        {activeTab === 'my_listings' && (
          <div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '10px 12px' }}>Supercar</th>
                    <th style={{ padding: '10px 12px' }}>Asking Price</th>
                    <th style={{ padding: '10px 12px' }}>Mileage</th>
                    <th style={{ padding: '10px 12px' }}>Chassis VIN</th>
                    <th style={{ padding: '10px 12px' }}>Certificate</th>
                    <th style={{ padding: '10px 12px' }}>Contact Phone</th>
                    <th style={{ padding: '10px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {myListings.map((car) => (
                    <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: '700', color: '#fff' }}>{car.title}</td>
                      <td style={{ padding: '10px 12px', fontWeight: '800', color: '#FFD700' }}>
                        ${Number(car.price).toLocaleString()}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#FFD700', fontFamily: 'monospace' }}>
                        {(car.mileage !== undefined ? car.mileage : (car.specs?.mileage || 150)).toLocaleString()} mi
                      </td>
                      <td style={{ padding: '10px 12px', color: '#00B4D8', fontFamily: 'monospace' }}>
                        {car.vin || car.specs?.vin || 'ZFF90...'}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#00D084' }}>
                        {car.certificateNumber || `FER-APP-2024-${String(car.id).padStart(3, '0')}`}
                      </td>
                      <td style={{ padding: '10px 12px', color: '#00D084' }}>
                        {car.sellerPhone || '+39 0536 949111'}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ background: 'rgba(0, 208, 132, 0.2)', color: '#00D084', padding: '3px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700' }}>
                          {car.status?.toUpperCase() || 'PUBLISHED'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
