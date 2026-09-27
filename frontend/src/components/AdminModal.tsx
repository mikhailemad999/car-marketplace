import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldAlert,
  BarChart3,
  Database,
  FileText,
  CheckCircle,
  Users,
  Car,
  DollarSign,
  Award,
  Phone,
  Trash2,
  FileCheck,
  ShieldCheck,
  Key,
  RefreshCw,
  Search,
  Calendar,
  Clock,
} from 'lucide-react';

interface AdminModalProps {
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({ onClose }) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'fleet' | 'users' | 'escrow' | 'appointments' | 'audit'>('analytics');
  const [analytics, setAnalytics] = useState<any>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAllAdminData = async () => {
    setRefreshing(true);
    try {
      const token = localStorage.getItem('ferrari_token');
      const headers = { Authorization: `Bearer ${token}` };

      const [anaRes, logRes, listRes, usrRes, payRes, aptRes] = await Promise.all([
        fetch('http://localhost:4000/admin/analytics', { headers }),
        fetch('http://localhost:4000/admin/audit-logs?limit=50', { headers }),
        fetch('http://localhost:4000/admin/listings', { headers }),
        fetch('http://localhost:4000/admin/users', { headers }),
        fetch('http://localhost:4000/admin/payments', { headers }),
        fetch('http://localhost:4000/appointments', { headers }),
      ]);

      if (anaRes.ok) setAnalytics(await anaRes.json());
      if (logRes.ok) setAuditLogs(await logRes.json());
      if (listRes.ok) setListings(await listRes.json());
      if (usrRes.ok) setUsers(await usrRes.json());
      if (payRes.ok) setPayments(await payRes.json());
      if (aptRes.ok) setAppointments(await aptRes.json());
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllAdminData();
  }, []);

  const handleUpdateRole = async (userId: number, newRole: string) => {
    try {
      const token = localStorage.getItem('ferrari_token');
      const res = await fetch(`http://localhost:4000/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) throw new Error('Role update failed');
      alert(`User ${userId} role updated to ${newRole}`);
      fetchAllAdminData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteListing = async (listingId: number) => {
    if (!confirm(`Are you sure you want to remove listing #${listingId} from the platform?`)) return;

    try {
      const token = localStorage.getItem('ferrari_token');
      const res = await fetch(`http://localhost:4000/admin/listings/${listingId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Delete failed');
      alert(`Listing #${listingId} removed`);
      fetchAllAdminData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleCertifyListing = async (listingId: number, currentCertified: boolean) => {
    try {
      const token = localStorage.getItem('ferrari_token');
      const newStatus = !currentCertified;
      const res = await fetch(`http://localhost:4000/admin/listings/${listingId}/certify`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          isCertified: newStatus,
          certificateNumber: newStatus ? `FER-APP-2024-${String(listingId).padStart(3, '0')}` : undefined,
          certificationType: 'Ferrari Approved 101-Point Inspection',
          inspectorNotes: 'Maranello inspection audit confirmed by Chief Technical Officer.',
        }),
      });

      if (!res.ok) throw new Error('Certification update failed');
      fetchAllAdminData();
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const formatCurrency = (val: number) => {
    return Number(val || 0).toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  };

  const filteredListings = listings.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.vin && c.vin.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (c.certificateNumber && c.certificateNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.9)',
        backdropFilter: 'blur(16px)',
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
          maxWidth: '1120px',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#0C0C10',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.95), 0 0 30px rgba(255, 215, 0, 0.2)',
          borderRadius: '20px',
          padding: '32px',
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

        {/* Header with Title & Refresh */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '10px',
                background: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid #FFD700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#FFD700',
              }}
            >
              <ShieldAlert size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#fff', margin: 0 }}>
                Maranello Command Center
              </h2>
              <div style={{ fontSize: '0.78rem', color: '#8E8E9F' }}>
                Full Platform Management · MySQL Port 3305 · Real-time Telemetry & Audit
              </div>
            </div>
          </div>

          <button
            onClick={fetchAllAdminData}
            disabled={refreshing}
            className="btn btn-secondary"
            style={{ padding: '8px 16px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            {refreshing ? 'Syncing...' : 'Sync MySQL'}
          </button>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '12px', marginBottom: '24px' }}>
          <button
            onClick={() => setActiveTab('analytics')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'analytics' ? '#E10600' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <BarChart3 size={15} /> Platform KPIs
          </button>

          <button
            onClick={() => setActiveTab('fleet')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'fleet' ? '#E10600' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Car size={15} /> Fleet Inventory ({listings.length})
          </button>

          <button
            onClick={() => setActiveTab('users')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'users' ? '#E10600' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Users size={15} /> Users & Roles ({users.length})
          </button>

          <button
            onClick={() => setActiveTab('escrow')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'escrow' ? '#E10600' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <DollarSign size={15} /> Escrow Ledger ({payments.length})
          </button>

          <button
            onClick={() => setActiveTab('appointments')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'appointments' ? '#E10600' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Calendar size={15} /> VIP Viewings ({appointments.length})
          </button>

          <button
            onClick={() => setActiveTab('audit')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: activeTab === 'audit' ? '#E10600' : 'rgba(255,255,255,0.05)',
              color: '#fff',
              fontSize: '0.82rem',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <FileText size={15} /> Audit Trail ({auditLogs.length})
          </button>
        </div>

        {/* TAB 1: Platform KPIs */}
        {activeTab === 'analytics' && (
          <div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '16px',
                marginBottom: '28px',
              }}
            >
              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Total Fleet GMV</div>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#FFD700' }}>
                  {analytics ? formatCurrency(analytics.totalInventoryValue) : '...'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00D084', marginTop: '4px' }}>
                  18 Certified Supercars
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Escrow Volume</div>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#00D084' }}>
                  {analytics ? formatCurrency(analytics.totalPaymentsVolume) : '...'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
                  Secured in MySQL Ledger
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Maranello Commission (2.5%)</div>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#E10600' }}>
                  {analytics ? formatCurrency(analytics.totalInventoryValue * 0.025) : '...'}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '4px' }}>
                  Projected Brokerage Yield
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '16px' }}>
                <div style={{ fontSize: '0.75rem', color: '#888', textTransform: 'uppercase' }}>Total Registered Clients</div>
                <div className="mono" style={{ fontSize: '1.4rem', fontWeight: '900', color: '#fff' }}>
                  {analytics ? analytics.totalUsers : users.length}
                </div>
                <div style={{ fontSize: '0.7rem', color: '#00D084', marginTop: '4px' }}>
                  RBAC (Admin, Seller, Buyer)
                </div>
              </div>
            </div>

            {/* Audit Logs Table */}
            <h3 style={{ fontSize: '1rem', fontWeight: '800', color: '#fff', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FileText size={16} color="#FFD700" />
              Real-time MySQL Audit Trail (Last 30 Events)
            </h3>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '10px 14px' }}>Action</th>
                    <th style={{ padding: '10px 14px' }}>Entity</th>
                    <th style={{ padding: '10px 14px' }}>User ID</th>
                    <th style={{ padding: '10px 14px' }}>Details</th>
                    <th style={{ padding: '10px 14px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.map((log) => (
                    <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '10px 14px', fontWeight: '700', color: '#E10600' }}>{log.action}</td>
                      <td style={{ padding: '10px 14px', color: '#FFD700' }}>{log.entity} #{log.entityId}</td>
                      <td style={{ padding: '10px 14px', color: '#AAA' }}>{log.userId}</td>
                      <td style={{ padding: '10px 14px', color: '#DDD', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {JSON.stringify(log.details)}
                      </td>
                      <td style={{ padding: '10px 14px', color: '#888' }}>
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: Fleet Management (Showing Phone, Certificate, Miles) */}
        {activeTab === 'fleet' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ position: 'relative', width: '320px' }}>
                <Search size={16} style={{ position: 'absolute', left: '12px', top: '10px', color: '#888' }} />
                <input
                  type="text"
                  placeholder="Filter by VIN, Certificate, or Model..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 36px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '0.8rem',
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8rem', color: '#888' }}>
                Showing {filteredListings.length} of {listings.length} supercars
              </div>
            </div>

            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '10px 12px' }}>Supercar</th>
                    <th style={{ padding: '10px 12px' }}>Year / Price</th>
                    <th style={{ padding: '10px 12px' }}>Mileage (Miles)</th>
                    <th style={{ padding: '10px 12px' }}>Chassis VIN</th>
                    <th style={{ padding: '10px 12px' }}>Maranello Certificate</th>
                    <th style={{ padding: '10px 12px' }}>Seller Phone</th>
                    <th style={{ padding: '10px 12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredListings.map((car) => {
                    const miles = car.mileage !== undefined ? car.mileage : (car.specs?.mileage || 150);
                    const vin = car.vin || car.specs?.vin || 'ZFF90...';
                    const cert = car.certificateNumber || `FER-APP-2024-${String(car.id).padStart(3, '0')}`;
                    const phone = car.sellerPhone || car.seller?.phone || '+39 0536 949111';

                    return (
                      <tr key={car.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: '700', color: '#fff' }}>{car.title}</div>
                          <div style={{ fontSize: '0.7rem', color: '#FFD700' }}>{car.color}</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ fontWeight: '800', color: '#FFF' }}>{formatCurrency(car.price)}</div>
                          <div style={{ fontSize: '0.7rem', color: '#888' }}>{car.year} SPEC</div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div className="mono" style={{ fontWeight: '800', color: '#FFD700' }}>
                            {miles.toLocaleString()} mi
                          </div>
                          <div style={{ fontSize: '0.68rem', color: '#888' }}>
                            {Math.round(miles * 1.60934).toLocaleString()} km
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <span className="mono" style={{ color: '#00B4D8', fontSize: '0.72rem' }}>{vin}</span>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: car.isCertified ? '#00D084' : '#888' }}>
                            <FileCheck size={13} />
                            <span className="mono" style={{ fontWeight: '700' }}>{cert}</span>
                          </div>
                          <div style={{ fontSize: '0.66rem', color: '#888' }}>
                            {car.certificationType?.substring(0, 24)}...
                          </div>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <a href={`tel:${phone}`} style={{ color: '#00D084', textDecoration: 'none', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Phone size={12} /> {phone}
                          </a>
                        </td>
                        <td style={{ padding: '10px 12px' }}>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => handleCertifyListing(car.id, !!car.isCertified)}
                              style={{
                                padding: '4px 8px',
                                borderRadius: '4px',
                                border: '1px solid rgba(255,215,0,0.4)',
                                background: car.isCertified ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.05)',
                                color: car.isCertified ? '#FFD700' : '#FFF',
                                fontSize: '0.7rem',
                                cursor: 'pointer',
                              }}
                              title="Toggle Maranello Inspection Certificate"
                            >
                              {car.isCertified ? 'Re-Certify' : 'Certify'}
                            </button>
                            <button
                              onClick={() => handleDeleteListing(car.id)}
                              style={{
                                padding: '4px 6px',
                                borderRadius: '4px',
                                border: '1px solid rgba(225,6,0,0.3)',
                                background: 'rgba(225,6,0,0.1)',
                                color: '#E10600',
                                cursor: 'pointer',
                              }}
                              title="Delete Listing"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: Users & Roles (Buyers, Sellers, Admins with Phone Numbers) */}
        {activeTab === 'users' && (
          <div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px' }}>Client ID</th>
                    <th style={{ padding: '12px 16px' }}>Full Name</th>
                    <th style={{ padding: '12px 16px' }}>Email</th>
                    <th style={{ padding: '12px 16px' }}>Phone Contact</th>
                    <th style={{ padding: '12px 16px' }}>Role</th>
                    <th style={{ padding: '12px 16px' }}>Permissions Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '12px 16px', color: '#888' }}>#{u.id}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '700', color: '#fff' }}>{u.name}</td>
                      <td style={{ padding: '12px 16px', color: '#FFD700' }}>{u.email}</td>
                      <td style={{ padding: '12px 16px', color: '#00D084', fontFamily: 'monospace' }}>
                        {u.phone || '+39 0536 949111'}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <span
                          style={{
                            padding: '3px 8px',
                            borderRadius: '4px',
                            fontSize: '0.72rem',
                            fontWeight: '800',
                            textTransform: 'uppercase',
                            background:
                              u.role === 'admin'
                                ? '#E10600'
                                : u.role === 'seller'
                                ? 'rgba(0, 208, 132, 0.2)'
                                : 'rgba(255, 255, 255, 0.1)',
                            color: u.role === 'seller' ? '#00D084' : '#fff',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <select
                          value={u.role}
                          onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                          style={{
                            padding: '4px 8px',
                            borderRadius: '6px',
                            background: 'rgba(255,255,255,0.08)',
                            color: '#fff',
                            border: '1px solid rgba(255,255,255,0.15)',
                            fontSize: '0.75rem',
                          }}
                        >
                          <option value="buyer">Buyer</option>
                          <option value="seller">Seller</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: Escrow Ledger */}
        {activeTab === 'escrow' && (
          <div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px' }}>Payment ID</th>
                    <th style={{ padding: '12px 16px' }}>Buyer</th>
                    <th style={{ padding: '12px 16px' }}>Supercar Vehicle</th>
                    <th style={{ padding: '12px 16px' }}>Escrow Deposit</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                    <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                        No escrow deposits placed yet. Place an acquisition deposit from any vehicle card!
                      </td>
                    </tr>
                  ) : (
                    payments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: '#888' }}>ESC-{p.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: '#fff' }}>
                          {p.buyer?.name || 'Alex Vance'}
                          <div style={{ fontSize: '0.7rem', color: '#888' }}>{p.buyer?.email}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#FFD700' }}>
                          {p.listing?.title || 'Ferrari Supercar'}
                        </td>
                        <td style={{ padding: '12px 16px', fontWeight: '900', color: '#00D084', fontFamily: 'monospace' }}>
                          {formatCurrency(p.amount)}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{ background: 'rgba(0, 208, 132, 0.2)', color: '#00D084', padding: '3px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: '700' }}>
                            HELD IN ESCROW
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#888' }}>
                          {new Date(p.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: VIP Appointments */}
        {activeTab === 'appointments' && (
          <div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px' }}>Appt ID</th>
                    <th style={{ padding: '12px 16px' }}>VIP Client</th>
                    <th style={{ padding: '12px 16px' }}>Supercar Vehicle</th>
                    <th style={{ padding: '12px 16px' }}>Date & Slot</th>
                    <th style={{ padding: '12px 16px' }}>Location</th>
                    <th style={{ padding: '12px 16px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                        No private showroom viewing appointments booked yet.
                      </td>
                    </tr>
                  ) : (
                    appointments.map((a) => (
                      <tr key={a.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: '#888' }}>APT-{a.id}</td>
                        <td style={{ padding: '12px 16px', fontWeight: '700', color: '#fff' }}>
                          {a.user?.name || 'Client'}
                          <div style={{ fontSize: '0.7rem', color: '#888' }}>{a.contactPhone || a.user?.email || 'N/A'}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#FFD700', fontWeight: '600' }}>
                          {a.listing?.title || 'Ferrari Supercar'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#EEE' }}>
                          <div>{a.preferredDate}</div>
                          <div style={{ fontSize: '0.7rem', color: '#888' }}>{a.timeSlot}</div>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#AAA', fontSize: '0.75rem' }}>
                          {a.location || 'Maranello VIP Atelier'}
                        </td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              background: a.status === 'confirmed' ? 'rgba(0, 208, 132, 0.2)' : 'rgba(255, 215, 0, 0.2)',
                              color: a.status === 'confirmed' ? '#00D084' : '#FFD700',
                              padding: '3px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              textTransform: 'uppercase',
                            }}
                          >
                            {a.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: Audit Trail */}
        {activeTab === 'audit' && (
          <div>
            <div style={{ background: 'rgba(0,0,0,0.4)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', textAlign: 'left' }}>
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)', color: '#8E8E9F', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '12px 16px' }}>Audit ID</th>
                    <th style={{ padding: '12px 16px' }}>Action Trigger</th>
                    <th style={{ padding: '12px 16px' }}>Entity Ref</th>
                    <th style={{ padding: '12px 16px' }}>Actor ID</th>
                    <th style={{ padding: '12px 16px' }}>Event Details</th>
                    <th style={{ padding: '12px 16px' }}>Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {auditLogs.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{ padding: '24px', textAlign: 'center', color: '#888' }}>
                        No audit log records found.
                      </td>
                    </tr>
                  ) : (
                    auditLogs.map((log) => (
                      <tr key={log.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                        <td style={{ padding: '12px 16px', color: '#888', fontFamily: 'monospace' }}>#{log.id}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span
                            style={{
                              background: log.action && log.action.includes('PAYMENT')
                                ? 'rgba(0, 208, 132, 0.15)'
                                : log.action && log.action.includes('CREATE')
                                ? 'rgba(225, 6, 0, 0.15)'
                                : 'rgba(255, 215, 0, 0.15)',
                              color: log.action && log.action.includes('PAYMENT')
                                ? '#00D084'
                                : log.action && log.action.includes('CREATE')
                                ? '#FF6B6B'
                                : '#FFD700',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontSize: '0.72rem',
                              fontWeight: '700',
                              fontFamily: 'monospace',
                            }}
                          >
                            {log.action}
                          </span>
                        </td>
                        <td style={{ padding: '12px 16px', color: '#AAA', textTransform: 'capitalize' }}>
                          {log.entity} #{log.entityId}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#FFF' }}>
                          User #{log.userId}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#8E8E9F', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {log.details ? (typeof log.details === 'object' ? JSON.stringify(log.details) : String(log.details)) : 'N/A'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#888', fontSize: '0.75rem' }}>
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
