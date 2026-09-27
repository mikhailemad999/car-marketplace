import React, { useState, useEffect } from 'react';
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Gauge,
  Zap,
  Check,
  Plus,
  Scale,
  Calculator,
  Flame,
  Award,
  Phone,
  ShieldCheck,
  MapPin,
  FileCheck,
  Heart,
} from 'lucide-react';

export interface CarListing {
  id: number;
  sellerId: number;
  title: string;
  description: string;
  price: string | number;
  status: string;
  model: string;
  color: string;
  year: number;
  mileage?: number;
  vin?: string;
  sellerPhone?: string;
  certificateNumber?: string;
  isCertified?: boolean;
  certificationType?: string;
  inspectionDate?: string;
  inspectorNotes?: string;
  location?: string;
  warranty?: string;
  specs: {
    engine?: string;
    horsepower?: number;
    acceleration?: string;
    topSpeed?: string;
    transmission?: string;
    drivetrain?: string;
    mileage?: number;
    vin?: string;
    hybridSystem?: string;
    downforce?: string;
  };
  seller?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  images?: Array<{ id: number; url: string; type: string }>;
}

interface SupercarInventoryProps {
  onSelectCar: (car: CarListing) => void;
  onOpenFinance: (car?: CarListing) => void;
  onOpenCompare: (cars: CarListing[]) => void;
  comparedCars: CarListing[];
  onToggleCompare: (car: CarListing) => void;
  refreshTrigger?: number;
  wishlistIds?: number[];
  onToggleWishlist?: (car: CarListing) => void;
  onOpenCertificate?: (car: CarListing) => void;
}

export const SupercarInventory: React.FC<SupercarInventoryProps> = ({
  onSelectCar,
  onOpenFinance,
  onOpenCompare,
  comparedCars,
  onToggleCompare,
  refreshTrigger,
  wishlistIds = [],
  onToggleWishlist,
  onOpenCertificate,
}) => {
  const [listings, setListings] = useState<CarListing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [maxPrice, setMaxPrice] = useState<number>(5500000);
  const [sortBy, setSortBy] = useState<'price' | 'year'>('price');
  const [sortOrder, setSortOrder] = useState<'ASC' | 'DESC'>('DESC');

  const CATEGORIES = [
    { id: 'all', label: 'All Fleet (18 Supercars)' },
    { id: 'wishlist', label: `❤️ Saved Garage (${wishlistIds.length})` },
    { id: 'hybrid', label: '⚡ Plug-in Hybrid (SF90 / 296)' },
    { id: 'v12', label: '🔥 Atmospheric V12 (812 / SP3 / Monza)' },
    { id: 'heritage', label: '🏆 Hypercar Legends (F40 / F50 / Enzo)' },
  ];

  const MODELS = [
    'All',
    'SF90 XX Stradale',
    'SF90 XX Spider',
    'SF90 Stradale',
    '812 Competizione',
    '296 GTB',
    'Daytona SP3',
    'Monza SP1',
    'Purosangue',
    'LaFerrari Aperta',
    'Ferrari F40',
    'Ferrari F50',
    'Enzo Ferrari',
  ];

  const fetchListings = async () => {
    setLoading(true);
    try {
      let url = `http://localhost:4000/listings?limit=50&sortBy=${sortBy}&sortOrder=${sortOrder}`;
      if (selectedModel !== 'All') {
        url += `&model=${encodeURIComponent(selectedModel)}`;
      }
      if (searchQuery.trim()) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      if (maxPrice < 5500000) {
        url += `&maxPrice=${maxPrice}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      if (data && data.data) {
        let filtered = data.data as CarListing[];

        // Filter by powertrain categories
        if (selectedCategory === 'wishlist') {
          filtered = filtered.filter((c) => wishlistIds.includes(c.id));
        } else if (selectedCategory === 'hybrid') {
          filtered = filtered.filter(
            (c) => c.model.includes('SF90') || c.model.includes('296') || c.model.includes('LaFerrari'),
          );
        } else if (selectedCategory === 'v12') {
          filtered = filtered.filter(
            (c) =>
              c.model.includes('812') ||
              c.model.includes('Daytona') ||
              c.model.includes('Monza') ||
              c.model.includes('Purosangue'),
          );
        } else if (selectedCategory === 'heritage') {
          filtered = filtered.filter(
            (c) =>
              c.model.includes('F40') ||
              c.model.includes('F50') ||
              c.model.includes('Enzo') ||
              c.model.includes('LaFerrari') ||
              c.model.includes('458') ||
              c.model.includes('488'),
          );
        }

        setListings(filtered);
      }
    } catch (err) {
      console.error('Failed to fetch listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, [selectedCategory, selectedModel, searchQuery, maxPrice, sortBy, sortOrder, refreshTrigger, wishlistIds]);

  const formatPrice = (price: string | number) => {
    return Number(price).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  return (
    <section id="inventory" style={{ padding: '80px 0', background: '#0a0a0c' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px', marginBottom: '32px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-ferrari">Maranello Fleet HQ</span>
              <span style={{ fontSize: '0.8rem', color: '#00D084', fontWeight: '700' }}>
                18 Certified Supercars Available
              </span>
            </div>
            <h2 style={{ fontSize: '2.6rem', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
              Supercar <span style={{ color: '#E10600' }}>Inventory</span>
            </h2>
            <p style={{ color: '#8E8E9F', marginTop: '6px' }}>
              Every vehicle certified through Ferrari’s 101-point mechanical inspection with genuine telemetry and provenance history.
            </p>
          </div>

          {/* Quick Tools Buttons & Search Input */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onOpenFinance()}
              className="btn btn-secondary"
              style={{ padding: '10px 18px', fontSize: '0.85rem' }}
            >
              <Calculator size={16} color="#00D084" />
              Finance Calculator
            </button>

            {comparedCars.length > 0 && (
              <button
                onClick={() => onOpenCompare(comparedCars)}
                className="btn btn-primary"
                style={{ padding: '10px 18px', fontSize: '0.85rem' }}
              >
                <Scale size={16} />
                Compare ({comparedCars.length}) Vehicles
              </button>
            )}

            <div style={{ position: 'relative', width: '280px' }}>
              <Search
                size={18}
                color="#888"
                style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                type="text"
                placeholder="Search model, year, VIN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px 12px 42px',
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '8px',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </div>

        {/* Powertrain Categories Tabs */}
        <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '20px' }}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                style={{
                  padding: '10px 20px',
                  borderRadius: '10px',
                  background: isSelected ? 'rgba(225, 6, 0, 0.2)' : 'rgba(255,255,255,0.04)',
                  color: isSelected ? '#FF3833' : '#aaa',
                  border: isSelected ? '1px solid #E10600' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Model Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '24px' }}>
          {MODELS.map((m) => {
            const isSelected = selectedModel === m;
            return (
              <button
                key={m}
                onClick={() => setSelectedModel(m)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  background: isSelected ? '#E10600' : 'transparent',
                  color: isSelected ? '#fff' : '#888',
                  border: isSelected ? '1px solid #E10600' : '1px solid rgba(255,255,255,0.08)',
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  whiteSpace: 'nowrap',
                }}
              >
                {m}
              </button>
            );
          })}
        </div>

        {/* Price Slider & Filter Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
            padding: '14px 20px',
            background: 'rgba(18, 18, 24, 0.6)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            marginBottom: '36px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '0.85rem', color: '#8E8E9F', fontWeight: '600' }}>
              Max Valuation: <span style={{ color: '#fff' }}>${(maxPrice / 1000000).toFixed(1)}M</span>
            </span>
            <input
              type="range"
              min={350000}
              max={5500000}
              step={100000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              style={{ accentColor: '#E10600', cursor: 'pointer', width: '160px' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: '#8E8E9F' }}>Sort by:</span>
            <select
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('_');
                setSortBy(sb as any);
                setSortOrder(so as any);
              }}
              style={{
                background: 'rgba(255,255,255,0.08)',
                color: '#fff',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.85rem',
                outline: 'none',
              }}
            >
              <option value="price_DESC">Price: High to Low</option>
              <option value="price_ASC">Price: Low to High</option>
              <option value="year_DESC">Year: Newest First</option>
            </select>
          </div>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#E10600', marginBottom: '8px' }}>
              Loading Ferrari Fleet...
            </div>
            <div>Syncing with MySQL database engine on port 3305</div>
          </div>
        ) : listings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', background: 'rgba(255,255,255,0.02)', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>No Supercars Found in this Category</h3>
            <p style={{ color: '#888' }}>Try clearing filters or switching categories.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
              gap: '28px',
            }}
          >
            {listings.map((car) => {
              const mainImg = car.images && car.images[0] ? car.images[0].url : '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg';
              const isCompared = comparedCars.some((c) => c.id === car.id);

              return (
                <div
                  key={car.id}
                  onClick={() => onSelectCar(car)}
                  className="glass-panel"
                  style={{
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    position: 'relative',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-6px)';
                    e.currentTarget.style.borderColor = 'rgba(225, 6, 0, 0.5)';
                    e.currentTarget.style.boxShadow = '0 14px 32px rgba(225, 6, 0, 0.22)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  {/* Photo with Overlay Gradient */}
                  <div style={{ position: 'relative', width: '100%', height: '230px', overflow: 'hidden' }}>
                    <img
                      src={mainImg}
                      alt={car.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                      onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
                      onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(18, 18, 23, 1) 0%, rgba(18, 18, 23, 0) 60%)',
                      }}
                    />

                    {/* Badges: Year, Miles, and Maranello Certification */}
                    <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', flexDirection: 'column', gap: '6px', zIndex: 4 }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span className="badge-ferrari" style={{ fontSize: '0.72rem', padding: '3px 8px' }}>
                          {car.year} SPEC
                        </span>
                        <span
                          style={{
                            background: 'rgba(0,0,0,0.8)',
                            border: '1px solid rgba(255,215,0,0.4)',
                            color: '#FFD700',
                            fontSize: '0.72rem',
                            fontWeight: '700',
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {(car.mileage !== undefined ? car.mileage : (car.specs?.mileage || 150)).toLocaleString()} MILES
                        </span>
                      </div>
                      {car.certificateNumber && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                            background: 'rgba(225, 6, 0, 0.9)',
                            color: '#FFF',
                            fontSize: '0.68rem',
                            fontWeight: '800',
                            padding: '2px 8px',
                            borderRadius: '4px',
                            width: 'fit-content',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.5)',
                            cursor: onOpenCertificate ? 'pointer' : 'default',
                          }}
                          onClick={(e) => {
                            if (onOpenCertificate) {
                              e.stopPropagation();
                              onOpenCertificate(car);
                            }
                          }}
                          title="Click to view official 101-Point Inspection Certificate"
                        >
                          <FileCheck size={12} />
                          {car.certificateNumber}
                        </div>
                      )}
                    </div>

                    {/* Action buttons (Wishlist & Compare) */}
                    <div style={{ position: 'absolute', top: '14px', right: '14px', display: 'flex', gap: '8px', zIndex: 5 }}>
                      {onToggleWishlist && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleWishlist(car);
                          }}
                          style={{
                            background: wishlistIds.includes(car.id) ? 'rgba(225, 6, 0, 0.45)' : 'rgba(0,0,0,0.65)',
                            border: wishlistIds.includes(car.id) ? '1px solid #E10600' : '1px solid rgba(255,255,255,0.2)',
                            borderRadius: '6px',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: wishlistIds.includes(car.id) ? '#FF6B6B' : '#fff',
                            cursor: 'pointer',
                          }}
                          title={wishlistIds.includes(car.id) ? 'Remove from Saved Garage' : 'Save to Dream Garage'}
                        >
                          <Heart size={15} fill={wishlistIds.includes(car.id) ? '#FF6B6B' : 'none'} />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleCompare(car);
                        }}
                        style={{
                          background: isCompared ? '#E10600' : 'rgba(0,0,0,0.6)',
                          border: isCompared ? '1px solid #fff' : '1px solid rgba(255,255,255,0.2)',
                          borderRadius: '6px',
                          padding: '6px 10px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          color: '#fff',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          cursor: 'pointer',
                        }}
                        title="Add to Comparison"
                      >
                        <Scale size={14} />
                        {isCompared ? 'Comparing' : 'Compare'}
                      </button>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '20px' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#FFD700', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {car.color}
                      </span>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', lineHeight: 1.2 }}>
                        {car.title}
                      </h3>
                    </div>

                    {/* Location & Seller Phone Line */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.72rem', color: '#A0A0B0', marginBottom: '10px' }}>
                      <MapPin size={12} color="#E10600" />
                      <span>{car.location || 'Maranello Scuderia, Italy'}</span>
                      <span style={{ margin: '0 2px' }}>•</span>
                      <Phone size={12} color="#00D084" />
                      <a
                        href={`tel:${car.sellerPhone || '+39 0536 949111'}`}
                        onClick={(e) => e.stopPropagation()}
                        style={{ color: '#00D084', textDecoration: 'none', fontWeight: '600' }}
                      >
                        {car.sellerPhone || '+39 0536 949111'}
                      </a>
                    </div>

                    <p style={{ fontSize: '0.85rem', color: '#9999A5', marginBottom: '16px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {car.description}
                    </p>

                    {/* Telemetry metrics bar */}
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(3, 1fr)',
                        gap: '8px',
                        padding: '12px',
                        background: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid rgba(255, 255, 255, 0.04)',
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Power</div>
                        <div className="mono" style={{ fontSize: '0.95rem', fontWeight: '800', color: '#E10600' }}>
                          {car.specs?.horsepower || 1000} CV
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>0-100</div>
                        <div className="mono" style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>
                          {car.specs?.acceleration || '2.5s'}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Top Speed</div>
                        <div className="mono" style={{ fontSize: '0.95rem', fontWeight: '800', color: '#fff' }}>
                          {car.specs?.topSpeed || '340 km/h'}
                        </div>
                      </div>
                    </div>

                    {/* Price & Action Row */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: '#888', textTransform: 'uppercase' }}>Asking Valuation</div>
                        <div className="mono" style={{ fontSize: '1.45rem', fontWeight: '900', color: '#FFF' }}>
                          {formatPrice(car.price)}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <a
                          href={`tel:${car.sellerPhone || '+39 0536 949111'}`}
                          onClick={(e) => e.stopPropagation()}
                          className="btn-icon"
                          style={{ color: '#00D084', borderColor: 'rgba(0, 208, 132, 0.4)' }}
                          title={`Direct Phone Call: ${car.sellerPhone || '+39 0536 949111'}`}
                        >
                          <Phone size={15} />
                        </a>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenFinance(car);
                          }}
                          className="btn-icon"
                          title="Calculate Lease / Finance"
                        >
                          <Calculator size={16} />
                        </button>

                        <button
                          className="btn btn-primary"
                          style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCar(car);
                          }}
                        >
                          Inspect
                          <ArrowUpRight size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
