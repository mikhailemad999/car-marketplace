import React, { useState, useEffect } from 'react';
import { X, Bell, CheckCircle2, ShieldCheck, DollarSign, Calendar, Clock, Trash2 } from 'lucide-react';

interface NotificationItem {
  id: number;
  content: string;
  type: string;
  readFlag: boolean;
  createdAt: string;
}

interface NotificationCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: any;
  onRefreshUnread: (count: number) => void;
}

export const NotificationCenterModal: React.FC<NotificationCenterModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onRefreshUnread,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && currentUser) {
      fetchNotifications();
    }
  }, [isOpen, currentUser]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('ferrari_token');
      const res = await fetch('http://localhost:4000/notifications', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        onRefreshUnread(data.unreadCount || 0);
      } else {
        // Fallback default demo notifications
        loadFallbackNotifications();
      }
    } catch {
      loadFallbackNotifications();
    } finally {
      setLoading(false);
    }
  };

  const loadFallbackNotifications = () => {
    const mockNotes: NotificationItem[] = [
      {
        id: 1,
        content: 'Ferrari Approved 101-Point Inspection certificate issued for SF90 XX Stradale (Chassis #0042).',
        type: 'in-app',
        readFlag: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 2,
        content: 'Escrow Reservation Confirmed: Hold deposit secured in Maranello Dealer Protocol.',
        type: 'in-app',
        readFlag: false,
        createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: 3,
        content: 'VIP Atelier Private Viewing invitation confirmed at Pista di Fiorano.',
        type: 'in-app',
        readFlag: true,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ];
    setNotifications(mockNotes);
    onRefreshUnread(2);
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      const token = localStorage.getItem('ferrari_token');
      await fetch(`http://localhost:4000/notifications/${id}/read`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Local update
    }
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readFlag: true } : n))
    );
    onRefreshUnread(Math.max(0, notifications.filter((n) => !n.readFlag && n.id !== id).length));
  };

  const handleMarkAllRead = async () => {
    try {
      const token = localStorage.getItem('ferrari_token');
      await fetch('http://localhost:4000/notifications/mark-all-read', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch {
      // Local update
    }
    setNotifications((prev) => prev.map((n) => ({ ...n, readFlag: true })));
    onRefreshUnread(0);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
        zIndex: 250,
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
          maxWidth: '540px',
          maxHeight: '85vh',
          display: 'flex',
          flexDirection: 'column',
          background: '#0B0B0F',
          borderRadius: '16px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
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
              <Bell size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '800', color: '#FFF' }}>
                Ferrari Concierge Alerts
              </h3>
              <p style={{ margin: 0, fontSize: '0.75rem', color: '#8E8E9F' }}>
                Real-time escrow, appointment, and certification dispatches
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {notifications.some((n) => !n.readFlag) && (
              <button
                onClick={handleMarkAllRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FFD700',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Mark all read
              </button>
            )}
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
        </div>

        {/* Content list */}
        <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {loading ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              Loading dispatches...
            </div>
          ) : notifications.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
              <CheckCircle2 size={32} color="#00D084" style={{ marginBottom: '10px' }} />
              <p style={{ margin: 0, fontWeight: '600' }}>All clear</p>
              <p style={{ margin: '4px 0 0', fontSize: '0.8rem', color: '#666' }}>
                You have no unread notifications from Maranello HQ.
              </p>
            </div>
          ) : (
            notifications.map((n) => {
              const isEscrow = n.content.toLowerCase().includes('escrow') || n.content.toLowerCase().includes('deposit');
              const isInspect = n.content.toLowerCase().includes('inspection') || n.content.toLowerCase().includes('certif');
              const isApt = n.content.toLowerCase().includes('viewing') || n.content.toLowerCase().includes('test drive') || n.content.toLowerCase().includes('appointment');

              return (
                <div
                  key={n.id}
                  onClick={() => !n.readFlag && handleMarkAsRead(n.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    borderRadius: '10px',
                    background: n.readFlag ? 'rgba(255, 255, 255, 0.02)' : 'rgba(225, 6, 0, 0.08)',
                    border: `1px solid ${n.readFlag ? 'rgba(255, 255, 255, 0.05)' : 'rgba(225, 6, 0, 0.25)'}`,
                    cursor: n.readFlag ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: isEscrow ? 'rgba(0, 208, 132, 0.15)' : isInspect ? 'rgba(255, 215, 0, 0.15)' : 'rgba(225, 6, 0, 0.15)',
                      color: isEscrow ? '#00D084' : isInspect ? '#FFD700' : '#E10600',
                      flexShrink: 0,
                    }}
                  >
                    {isEscrow ? <DollarSign size={16} /> : isInspect ? <ShieldCheck size={16} /> : isApt ? <Calendar size={16} /> : <Bell size={16} />}
                  </div>

                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontSize: '0.84rem', color: '#EEE', lineHeight: '1.4' }}>
                      {n.content}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                      <Clock size={12} color="#666" />
                      <span style={{ fontSize: '0.7rem', color: '#777' }}>
                        {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(n.createdAt).toLocaleDateString()}
                      </span>
                      {!n.readFlag && (
                        <span style={{ fontSize: '0.65rem', padding: '1px 6px', background: '#E10600', color: '#FFF', borderRadius: '4px', fontWeight: '700' }}>
                          NEW
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '12px 24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            justifyContent: 'flex-end',
            background: 'rgba(0, 0, 0, 0.2)',
          }}
        >
          <button onClick={onClose} className="btn btn-secondary" style={{ padding: '6px 16px', fontSize: '0.85rem' }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
