import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function ServiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 0, comment: '' });
  const [bookingModal, setBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({ notes: '', bookingDate: '' });
  const [bookingSuccess, setBookingSuccess] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const servicesRes = await axios.get('http://localhost:8080/api/services');
        const found = servicesRes.data.find((s) => s.id === id);
        if (found) {
          setService(found);
          try {
            const reviewsRes = await axios.get(
              `http://localhost:8080/api/reviews/provider/${found.providerId}`
            );
            setReviews(reviewsRes.data);
          } catch (e) { /* no reviews yet */ }
        }
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post('http://localhost:8080/api/bookings', {
        serviceId: service.id,
        notes: bookingForm.notes,
        bookingDate: bookingForm.bookingDate + 'T10:00:00'
      }, { headers: { Authorization: `Bearer ${token}` } });
      setBookingSuccess('Booking created successfully!');
      setBookingModal(false);
      setTimeout(() => setBookingSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!token) { navigate('/login'); return; }
    try {
      await axios.post('http://localhost:8080/api/reviews', {
        providerId: service.providerId,
        customerId: user.email,
        customerName: user.fullName,
        rating: reviewForm.rating,
        comment: reviewForm.comment
      });
      setReviewSuccess('Review submitted!');
      setReviewForm({ rating: 0, comment: '' });
      // Refresh reviews
      const res = await axios.get(
        `http://localhost:8080/api/reviews/provider/${service.providerId}`
      );
      setReviews(res.data);
      setTimeout(() => setReviewSuccess(''), 3000);
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner text="Loading service details..." />;
  if (!service) return (
    <div className="detail-page">
      <div className="container">
        <div className="empty-state">
          <span className="empty-state-icon">😕</span>
          <h3>Service not found</h3>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    </div>
  );

  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="detail-page">
      <div className="container">
        {/* Header Image */}
        <div className="detail-header">
          <img src="/images/service-placeholder.png" alt={service.title} />
          <div className="detail-header-overlay">
            <span className="category-badge" style={{ marginBottom: '12px', display: 'inline-block' }}>
              {service.category}
            </span>
            <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '36px', fontWeight: 800 }}>
              {service.title}
            </h1>
          </div>
        </div>

        {bookingSuccess && <div className="form-success">{bookingSuccess}</div>}

        <div className="detail-grid">
          {/* Main Content */}
          <div className="detail-main">
            <div className="glass-card" style={{ marginBottom: '24px' }}>
              <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>About This Service</h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7 }}>{service.description}</p>
              <div style={{ display: 'flex', gap: '24px', marginTop: '20px', flexWrap: 'wrap' }}>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>📍 {service.address}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>👤 {service.providerName}</span>
              </div>
            </div>

            {/* Map */}
            {service.latitude && service.longitude && (
              <div className="glass-card" style={{ marginBottom: '24px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)', marginBottom: '12px' }}>Location</h3>
                <div className="map-container">
                  <MapContainer
                    center={[service.latitude, service.longitude]}
                    zoom={15}
                    style={{ height: '250px', width: '100%' }}
                  >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Marker position={[service.latitude, service.longitude]} />
                  </MapContainer>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div className="glass-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontFamily: 'var(--font-heading)' }}>
                  Reviews ({reviews.length})
                </h3>
                {reviews.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <StarRating rating={Math.round(avgRating)} />
                    <span style={{ fontWeight: 700 }}>{avgRating}</span>
                  </div>
                )}
              </div>

              {reviewSuccess && <div className="form-success">{reviewSuccess}</div>}

              {/* Add Review Form */}
              {token && (
                <form onSubmit={handleReview} style={{
                  marginBottom: '24px', padding: '20px',
                  background: 'var(--bg-glass)', borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)'
                }}>
                  <p style={{ fontWeight: 600, marginBottom: '12px', fontSize: '14px' }}>Leave a Review</p>
                  <StarRating
                    rating={reviewForm.rating}
                    onRate={(r) => setReviewForm({ ...reviewForm, rating: r })}
                    interactive
                    size={24}
                  />
                  <textarea className="form-input" placeholder="Write your review..."
                    value={reviewForm.comment}
                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                    rows={3} style={{ marginTop: '12px' }} required />
                  <button className="btn btn-primary btn-sm" type="submit" style={{ marginTop: '10px' }}
                    disabled={reviewForm.rating === 0}>
                    Submit Review
                  </button>
                </form>
              )}

              {reviews.length > 0 ? reviews.map((review) => (
                <div className="review-card" key={review.id}>
                  <div className="review-header">
                    <div>
                      <span className="review-author">{review.customerName}</span>
                      <StarRating rating={review.rating} size={14} />
                    </div>
                    <span className="review-date">
                      {review.createdAt ? new Date(review.createdAt).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="review-text">{review.comment}</p>
                </div>
              )) : (
                <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '20px 0' }}>
                  No reviews yet. Be the first to review!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="detail-sidebar">
            <div className="glass-card">
              <div className="service-price" style={{ fontSize: '32px', marginBottom: '4px' }}>
                ₹{service.price}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                per service
              </p>

              <button className="btn btn-primary btn-block btn-lg"
                onClick={() => token ? setBookingModal(true) : navigate('/login')}
                id="book-service-btn">
                📅 Book This Service
              </button>

              {service.providerId && (
                <Link to={`/provider/${service.providerId}`}
                  className="btn btn-secondary btn-block" style={{ marginTop: '12px' }}>
                  👤 View Provider Profile
                </Link>
              )}

              <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Provider</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{service.providerName}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Rating</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>
                    {avgRating > 0 ? `⭐ ${avgRating}` : 'New'}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Reviews</span>
                  <span style={{ fontSize: '13px', fontWeight: 600 }}>{reviews.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {bookingModal && (
        <div className="modal-overlay" onClick={() => setBookingModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>📅 Book: {service.title}</h3>
            <form onSubmit={handleBooking}>
              <div className="form-group">
                <label>Preferred Date</label>
                <input className="form-input" type="date" value={bookingForm.bookingDate}
                  onChange={(e) => setBookingForm({ ...bookingForm, bookingDate: e.target.value })}
                  required min={new Date().toISOString().split('T')[0]} />
              </div>
              <div className="form-group">
                <label>Notes (optional)</label>
                <textarea className="form-input" placeholder="Any special requirements..."
                  value={bookingForm.notes} rows={3}
                  onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })} />
              </div>
              <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                <button className="btn btn-primary btn-block" type="submit">
                  Confirm Booking
                </button>
                <button className="btn btn-secondary" type="button"
                  onClick={() => setBookingModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ServiceDetail;
