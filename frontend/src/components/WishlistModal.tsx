import React from 'react';
import { X, Heart, Trash2, ArrowUpRight, Gauge, Zap, Scale, DollarSign } from 'lucide-react';
import { CarListing } from './SupercarInventory';

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedCars: CarListing[];
  onSelectCar: (car: CarListing) => void;
  onRemoveFavorite: (carId: number) => void;
  onToggleCompare: (car: CarListing) => void;
  comparedCars: CarListing[];
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  savedCars,
  onSelectCar,
  onRemoveFavorite,
  onToggleCompare,
  comparedCars,
}) => {
  if (!isOpen) return null;

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
        background: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)',
        zIndex: 240,
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
          maxWidth: '820px',
          maxHeight: '88vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0B0B0F',
          borderRadius: '16px',
          border: '1px solid rgba(225, 6, 0, 0.3)',
          boxShadow: '0 25px 50px -12px rgba(225, 6, 0, 0.25)',
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '20px 24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'rgba(225, 6, 0, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#E10600',
              }}
            >
              <Heart size={20} fill="#E10600" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: '800', color: '#FFF' }}>
                My Scuderia Dream Garage
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#8E8E9F' }}>
                {savedCars.length} Supercars Saved in Private Wishlist
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
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

        {/* Content list */}
        <div style={{ padding: '20px', overflowY: 'auto', flex: 1 }}>
          {savedCars.length === 0 ? (
            <div style={{ padding: '60px 20px', textAlign: 'center', color: '#888' }}>
              <Heart size={40} color="#444" style={{ marginBottom: '14px' }} />
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: '700', color: '#FFF' }}>
                Your Dream Garage is Empty
              </p>
              <p style={{ margin: '6px 0 0', fontSize: '0.85rem', color: '#777' }}>
                Click the heart icon on any Ferrari in the fleet inventory to track and save it here.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
              {savedCars.map((car) => {
                const img = car.images && car.images[0] ? car.images[0].url : '/cars/2024-ferrari-sf90-xx-stradale-101-654a6690b6426.jpg';
                const isCompared = comparedCars.some((c) => c.id === car.id);

                return (
                  <div
                    key={car.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    <div style={{ position: 'relative', height: '160px', overflow: 'hidden' }}>
                      <img
                        src={img}
                        alt={car.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        onClick={() => onRemoveFavorite(car.id)}
                        style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          background: 'rgba(0, 0, 0, 0.65)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '32px',
                          height: '32px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#E10600',
                          cursor: 'pointer',
                        }}
                        title="Remove from wishlist"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div style={{ padding: '14px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: '800', color: '#FFF' }}>
                            {car.title}
                          </h4>
                          <span style={{ fontSize: '0.72rem', color: '#888' }}>
                            {car.year} • {car.color} • {car.specs?.horsepower || 1000} CV
                          </span>
                        </div>
                        <span style={{ fontSize: '1.05rem', fontWeight: '900', color: '#FFD700' }}>
                          {formatPrice(car.price)}
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                        <button
                          onClick={() => {
                            onSelectCar(car);
                            onClose();
                          }}
                          className="btn btn-primary"
                          style={{ flex: 1, padding: '7px 12px', fontSize: '0.8rem' }}
                        >
                          <ArrowUpRight size={14} />
                          View Details
                        </button>
                        <button
                          onClick={() => onToggleCompare(car)}
                          className="btn btn-secondary"
                          style={{
                            padding: '7px 12px',
                            fontSize: '0.8rem',
                            color: isCompared ? '#E10600' : '#AAA',
                            borderColor: isCompared ? '#E10600' : 'rgba(255, 255, 255, 0.15)',
                          }}
                        >
                          <Scale size={14} />
                          {isCompared ? 'Compared' : 'Compare'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
