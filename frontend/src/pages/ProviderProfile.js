import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';

function ProviderProfile() {
  const { id } = useParams();
  const [profile, setProfile] = useState(null);
  const [services, setServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profileRes = await axios.get(`http://localhost:8080/api/profiles/${id}`);
        setProfile(profileRes.data);
      } catch (e) {
        setProfile({ userId: id, fullName: 'Provider', bio: '', rating: 0, totalReviews: 0 });
      }

      try {
        const allServices = await axios.get('http://localhost:8080/api/services');
        setServices(allServices.data.filter((s) => s.providerId === id));
      } catch (e) { /* ignore */ }

      try {
        const reviewsRes = await axios.get(`http://localhost:8080/api/reviews/provider/${id}`);
        setReviews(reviewsRes.data);
      } catch (e) { /* ignore */ }

      try {
        const postsRes = await axios.get(`http://localhost:8080/api/posts/provider/${id}`);
        setPosts(postsRes.data);
      } catch (e) { /* ignore */ }

      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return <LoadingSpinner text="Loading profile..." />;

  const initial = profile?.fullName ? profile.fullName.charAt(0).toUpperCase() : '?';
  const avgRating = reviews.length > 0
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : profile?.rating?.toFixed(1) || '0.0';

  return (
    <div className="detail-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Profile Banner */}
        <div className="profile-banner"></div>
        <div className="profile-avatar-large">{initial}</div>

        <div className="profile-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <h1 className="profile-name">{profile?.fullName || 'Provider'}</h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
                <StarRating rating={Math.round(Number(avgRating))} />
                <span style={{ fontWeight: 700 }}>{avgRating}</span>
                <span style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <span className="btn btn-secondary btn-sm">
                📍 {profile?.address || 'Location not set'}
              </span>
              {profile?.phone && (
                <span className="btn btn-secondary btn-sm">📞 {profile.phone}</span>
              )}
            </div>
          </div>

          {profile?.bio && (
            <p className="profile-bio">{profile.bio}</p>
          )}

          {profile?.specialities && profile.specialities.length > 0 && (
            <div className="profile-tags">
              {profile.specialities.map((s, i) => (
                <span className="profile-tag" key={i}>{s}</span>
              ))}
            </div>
          )}
        </div>

        {/* Performance Posts / Portfolio */}
        {posts.length > 0 && (
          <div style={{ marginTop: '32px' }}>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
              📸 Portfolio
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
              {posts.map((post) => (
                <div className="glass-card" key={post.id}>
                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.title}
                      style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '12px' }} />
                  )}
                  <h4 style={{ fontWeight: 700, marginBottom: '6px' }}>{post.title}</h4>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{post.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Services */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            🛠️ Services ({services.length})
          </h2>
          {services.length > 0 ? (
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No services listed yet</p>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '24px', fontWeight: 700, marginBottom: '20px' }}>
            ⭐ Reviews ({reviews.length})
          </h2>
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
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No reviews yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderProfile;
