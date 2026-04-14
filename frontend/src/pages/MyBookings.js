import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [providerBookings, setProviderBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('my');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchBookings();
    // eslint-disable-next-line
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/bookings/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBookings(res.data);

      if (user.role === 'PROVIDER') {
        const pRes = await axios.get('http://localhost:8080/api/bookings/provider', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setProviderBookings(pRes.data);
      }
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateStatus = async (bookingId, status) => {
    try {
      await axios.put(`http://localhost:8080/api/bookings/${bookingId}/status?status=${status}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchBookings();
    } catch (err) { console.error(err); }
  };

  const renderBookingCard = (booking, isProvider = false) => (
    <div className="booking-card" key={booking.id}>
      <div className="booking-header">
        <div>
          <h3 className="booking-title">{booking.serviceTitle}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
            {isProvider ? `Customer: ${booking.customerName}` : `Provider: ${booking.providerName}`}
          </p>
        </div>
        <span className={`status-badge status-${booking.status}`}>{booking.status}</span>
      </div>
      <div className="booking-meta">
        <span>💰 ₹{booking.price}</span>
        <span>📅 {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : 'Flexible'}</span>
        <span>🕐 {new Date(booking.createdAt).toLocaleDateString()}</span>
      </div>
      {booking.notes && (
        <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
          📝 {booking.notes}
        </p>
      )}
      {isProvider && booking.status === 'PENDING' && (
        <div className="booking-actions">
          <button className="btn btn-success btn-sm" onClick={() => updateStatus(booking.id, 'CONFIRMED')}>
            ✅ Accept
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(booking.id, 'CANCELLED')}>
            ❌ Decline
          </button>
        </div>
      )}
      {isProvider && booking.status === 'CONFIRMED' && (
        <div className="booking-actions">
          <button className="btn btn-primary btn-sm" onClick={() => updateStatus(booking.id, 'IN_PROGRESS')}>
            🔄 Start Work
          </button>
        </div>
      )}
      {isProvider && booking.status === 'IN_PROGRESS' && (
        <div className="booking-actions">
          <button className="btn btn-success btn-sm" onClick={() => updateStatus(booking.id, 'COMPLETED')}>
            ✅ Mark Complete
          </button>
        </div>
      )}
      {!isProvider && booking.status === 'PENDING' && (
        <div className="booking-actions">
          <button className="btn btn-danger btn-sm" onClick={() => updateStatus(booking.id, 'CANCELLED')}>
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );

  if (loading) return <LoadingSpinner text="Loading bookings..." />;

  return (
    <div className="detail-page">
      <div className="container" style={{ maxWidth: '800px' }}>
        <div className="dashboard-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800 }}>
            📅 My Bookings
          </h1>
        </div>

        {/* Tabs for provider */}
        {user.role === 'PROVIDER' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <button
              className={`btn ${activeTab === 'my' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('my')}
            >
              My Bookings ({bookings.length})
            </button>
            <button
              className={`btn ${activeTab === 'received' ? 'btn-primary' : 'btn-secondary'} btn-sm`}
              onClick={() => setActiveTab('received')}
            >
              Received Requests ({providerBookings.length})
            </button>
          </div>
        )}

        {/* Bookings List */}
        {activeTab === 'my' && (
          bookings.length > 0 ? bookings.map((b) => renderBookingCard(b, false)) : (
            <div className="empty-state">
              <span className="empty-state-icon">📅</span>
              <h3>No bookings yet</h3>
              <p>Browse services and book your first appointment</p>
            </div>
          )
        )}
        {activeTab === 'received' && (
          providerBookings.length > 0 ? providerBookings.map((b) => renderBookingCard(b, true)) : (
            <div className="empty-state">
              <span className="empty-state-icon">📋</span>
              <h3>No requests received</h3>
              <p>When customers book your services, they'll appear here</p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default MyBookings;
