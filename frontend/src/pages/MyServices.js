import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';

function MyServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) { navigate('/login'); return; }
    fetchMyServices();
    // eslint-disable-next-line
  }, []);

  const fetchMyServices = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/services/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const deleteService = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      await axios.delete(`http://localhost:8080/api/services/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setServices(services.filter((s) => s.id !== id));
    } catch (err) { console.error(err); }
  };

  if (loading) return <LoadingSpinner text="Loading your services..." />;

  return (
    <div className="detail-page">
      <div className="container" style={{ maxWidth: '900px' }}>
        <div className="dashboard-header">
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '32px', fontWeight: 800 }}>
            🛠️ My Services
          </h1>
          <Link to="/add-service" className="btn btn-primary">
            + Add New Service
          </Link>
        </div>

        {/* Stats */}
        <div className="dashboard-stats">
          <div className="stat-card">
            <div className="stat-value">{services.length}</div>
            <div className="stat-label">Total Services</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{services.filter((s) => s.active).length}</div>
            <div className="stat-label">Active</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">
              {services.length > 0
                ? `₹${Math.round(services.reduce((a, s) => a + (s.price || 0), 0) / services.length)}`
                : '₹0'}
            </div>
            <div className="stat-label">Avg. Price</div>
          </div>
        </div>

        {/* Service List */}
        {services.length > 0 ? services.map((service) => (
          <div className="booking-card" key={service.id}>
            <div className="booking-header">
              <div>
                <h3 className="booking-title">{service.title}</h3>
                <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {service.category} • {service.address}
                </p>
              </div>
              <span className="service-price" style={{ fontSize: '20px' }}>₹{service.price}</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '12px 0' }}>
              {service.description}
            </p>
            <div className="booking-actions">
              <Link to={`/service/${service.id}`} className="btn btn-secondary btn-sm">
                👁️ View
              </Link>
              <button className="btn btn-danger btn-sm" onClick={() => deleteService(service.id)}>
                🗑️ Delete
              </button>
            </div>
          </div>
        )) : (
          <div className="empty-state">
            <span className="empty-state-icon">🛠️</span>
            <h3>No services listed yet</h3>
            <p>Start by adding your first service to reach customers</p>
            <Link to="/add-service" className="btn btn-primary">Add Service</Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyServices;
