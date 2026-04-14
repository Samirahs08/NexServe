import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import StarRating from '../components/StarRating';
import LoadingSpinner from '../components/LoadingSpinner';

const CATEGORY_INFO = {
  Cleaning: { icon: '🧹', image: '/images/cat-cleaning.png', desc: 'Professional cleaning services for homes and offices' },
  Plumbing: { icon: '🔧', image: '/images/cat-plumbing.png', desc: 'Expert plumbing repair, installation and maintenance' },
  Electrical: { icon: '⚡', image: '/images/cat-electrical.png', desc: 'Licensed electricians for all your electrical needs' },
  Carpentry: { icon: '🪚', image: '/images/cat-carpentry.png', desc: 'Skilled carpenters for furniture, repairs and woodwork' },
  Painting: { icon: '🎨', image: '/images/cat-painting.png', desc: 'Interior and exterior painting professionals' },
  Tutoring: { icon: '📚', image: '/images/cat-tutoring.png', desc: 'Expert tutors for academic and skill-based learning' },
  Cooking: { icon: '👨‍🍳', image: '/images/cat-cooking.png', desc: 'Professional chefs and cooking service providers' },
  Other: { icon: '✨', image: '/images/cat-other.png', desc: 'Various other professional services' },
};

function CategoryServices() {
  const { name } = useParams();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState({});
  const [reviews, setReviews] = useState({});
  const [loading, setLoading] = useState(true);
  const catInfo = CATEGORY_INFO[name] || { icon: '✨', image: '/images/service-placeholder.png', desc: '' };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8080/api/services/category/${name}`);
        setServices(res.data);

        // Fetch provider profiles and reviews for each unique provider
        const uniqueProviders = [...new Set(res.data.map(s => s.providerId).filter(Boolean))];
        const profilePromises = uniqueProviders.map(async (pid) => {
          try {
            const pRes = await axios.get(`http://localhost:8080/api/profiles/${pid}`);
            return { id: pid, profile: pRes.data };
          } catch { return { id: pid, profile: null }; }
        });
        const reviewPromises = uniqueProviders.map(async (pid) => {
          try {
            const rRes = await axios.get(`http://localhost:8080/api/reviews/provider/${pid}`);
            return { id: pid, reviews: rRes.data };
          } catch { return { id: pid, reviews: [] }; }
        });

        const profileResults = await Promise.all(profilePromises);
        const reviewResults = await Promise.all(reviewPromises);

        const profileMap = {};
        profileResults.forEach(r => { if (r.profile) profileMap[r.id] = r.profile; });
        setProviders(profileMap);

        const reviewMap = {};
        reviewResults.forEach(r => { reviewMap[r.id] = r.reviews; });
        setReviews(reviewMap);
      } catch (err) { console.error(err); }
      setLoading(false);
    };
    fetchData();
  }, [name]);

  const getAvgRating = (providerId) => {
    const providerReviews = reviews[providerId] || [];
    if (providerReviews.length === 0) return 0;
    return (providerReviews.reduce((a, r) => a + r.rating, 0) / providerReviews.length).toFixed(1);
  };

  if (loading) return <LoadingSpinner text={`Finding ${name} services...`} />;

  return (
    <div className="detail-page">
      <div className="container">
        {/* Category Hero Banner */}
        <div className="cat-hero">
          <div className="cat-hero-bg">
            <img src={catInfo.image} alt={name} />
            <div className="cat-hero-overlay"></div>
          </div>
          <div className="cat-hero-content">
            <Link to="/" className="btn btn-secondary btn-sm" style={{ marginBottom: '16px' }}>
              ← Back to Home
            </Link>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>{catInfo.icon}</span>
            <h1 style={{
              fontFamily: 'var(--font-heading)', fontSize: '42px',
              fontWeight: 800, marginBottom: '12px'
            }}>
              {name} Services
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '16px', maxWidth: '500px' }}>
              {catInfo.desc}
            </p>
            <div style={{ marginTop: '20px', display: 'flex', gap: '24px' }}>
              <div className="hero-stat">
                <h3 style={{ fontSize: '24px' }}>{services.length}</h3>
                <p>Services Available</p>
              </div>
              <div className="hero-stat">
                <h3 style={{ fontSize: '24px' }}>{Object.keys(providers).length}</h3>
                <p>Verified Providers</p>
              </div>
            </div>
          </div>
        </div>

        {/* Services with Provider Details */}
        {services.length > 0 ? (
          <div style={{ marginTop: '40px' }}>
            <h2 style={{
              fontFamily: 'var(--font-heading)', fontSize: '24px',
              fontWeight: 700, marginBottom: '24px'
            }}>
              All {name} Services
            </h2>

            {services.map((service) => {
              const provider = providers[service.providerId] || {};
              const avgRating = getAvgRating(service.providerId);
              const providerReviews = reviews[service.providerId] || [];
              const initial = (provider.fullName || service.providerName || '?').charAt(0).toUpperCase();

              return (
                <div className="cat-service-card" key={service.id}>
                  <div className="cat-service-main">
                    {/* Service Image */}
                    <div className="cat-service-img">
                      <img src="/images/service-placeholder.png" alt={service.title} />
                    </div>

                    {/* Service Info */}
                    <div className="cat-service-info">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div>
                          <Link to={`/service/${service.id}`} style={{ textDecoration: 'none' }}>
                            <h3 style={{
                              fontFamily: 'var(--font-heading)', fontSize: '20px',
                              fontWeight: 700, color: 'var(--text-primary)',
                              marginBottom: '4px'
                            }}>
                              {service.title}
                            </h3>
                          </Link>
                          <span className="category-badge">{service.category}</span>
                        </div>
                        <span className="service-price" style={{ fontSize: '26px' }}>₹{service.price}</span>
                      </div>

                      <p style={{
                        color: 'var(--text-secondary)', fontSize: '14px',
                        lineHeight: 1.6, margin: '12px 0'
                      }}>
                        {service.description}
                      </p>

                      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', fontSize: '13px', color: 'var(--text-muted)' }}>
                        <span>📍 {service.address}</span>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
                        <Link to={`/service/${service.id}`} className="btn btn-primary btn-sm">
                          📅 Book Now
                        </Link>
                        <Link to={`/provider/${service.providerId}`} className="btn btn-secondary btn-sm">
                          👤 View Provider
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Provider Details Panel */}
                  <div className="cat-provider-panel">
                    <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                      <div style={{
                        width: '56px', height: '56px', borderRadius: '50%',
                        background: 'var(--accent-gradient)', margin: '0 auto 10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '22px', fontWeight: 800, color: 'white',
                        fontFamily: 'var(--font-heading)',
                        overflow: 'hidden'
                      }}>
                        {provider.profileImageUrl ? (
                          <img src={provider.profileImageUrl} alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => { e.target.style.display = 'none'; e.target.parentElement.textContent = initial; }} />
                        ) : initial}
                      </div>
                      <Link to={`/provider/${service.providerId}`} style={{ textDecoration: 'none' }}>
                        <h4 style={{
                          fontWeight: 700, fontSize: '15px',
                          color: 'var(--text-primary)', marginBottom: '4px'
                        }}>
                          {provider.fullName || service.providerName}
                        </h4>
                      </Link>

                      {avgRating > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '6px' }}>
                          <StarRating rating={Math.round(Number(avgRating))} size={14} />
                          <span style={{ fontWeight: 700, fontSize: '13px' }}>{avgRating}</span>
                        </div>
                      )}
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        {providerReviews.length} review{providerReviews.length !== 1 ? 's' : ''}
                      </span>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '12px', fontSize: '13px' }}>
                      {provider.phone && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>📞 Phone</span>
                          <span style={{ fontWeight: 600 }}>{provider.phone}</span>
                        </div>
                      )}
                      {provider.address && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ color: 'var(--text-muted)' }}>📍 Area</span>
                          <span style={{ fontWeight: 600 }}>{provider.address}</span>
                        </div>
                      )}
                      {provider.specialities && provider.specialities.length > 0 && (
                        <div style={{ marginTop: '10px' }}>
                          <span style={{ color: 'var(--text-muted)', fontSize: '12px', display: 'block', marginBottom: '6px' }}>Specialities</span>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                            {provider.specialities.slice(0, 3).map((s, i) => (
                              <span className="profile-tag" key={i} style={{ fontSize: '11px', padding: '3px 8px' }}>{s}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="empty-state" style={{ marginTop: '40px' }}>
            <span className="empty-state-icon">🔍</span>
            <h3>No {name} services found</h3>
            <p>Be the first to offer {name.toLowerCase()} services in your area</p>
            <Link to="/add-service" className="btn btn-primary">Add Service</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default CategoryServices;
