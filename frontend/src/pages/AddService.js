import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

function LocationPicker({ onLocationSelect, position }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position ? <Marker position={[position.lat, position.lng]} /> : null;
}

const CATEGORIES = [
  { name: 'Cleaning', icon: '🧹' },
  { name: 'Plumbing', icon: '🔧' },
  { name: 'Electrical', icon: '⚡' },
  { name: 'Carpentry', icon: '🪚' },
  { name: 'Painting', icon: '🎨' },
  { name: 'Tutoring', icon: '📚' },
  { name: 'Cooking', icon: '👨‍🍳' },
  { name: 'Other', icon: '✨' },
];

function AddService() {
  const [form, setForm] = useState({
    title: '', description: '', category: '', price: '',
    latitude: '', longitude: '', address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [mapPosition, setMapPosition] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;
      setForm({ ...form, latitude: lat, longitude: lng });
      setMapPosition({ lat, lng });
    });
  };

  const handleMapClick = (lat, lng) => {
    setForm({ ...form, latitude: lat, longitude: lng });
    setMapPosition({ lat, lng });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) { navigate('/login'); return; }
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:8080/api/services', {
        ...form,
        price: parseFloat(form.price),
        latitude: parseFloat(form.latitude),
        longitude: parseFloat(form.longitude)
      }, { headers: { Authorization: `Bearer ${token}` } });
      setSuccess('Service added successfully! Redirecting...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError('Failed to add service. Please check all fields and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="detail-page">
      <div className="container" style={{ maxWidth: '700px' }}>
        <div className="glass-card" style={{ animation: 'slideUp 0.6s ease' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)', fontSize: '28px',
            fontWeight: 800, marginBottom: '8px', textAlign: 'center'
          }}>
            Add Your Service 🛠️
          </h2>
          <p style={{
            textAlign: 'center', color: 'var(--text-secondary)',
            marginBottom: '32px', fontSize: '15px'
          }}>
            List your professional service and reach customers near you
          </p>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">{success}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Service Title</label>
              <input className="form-input" type="text" name="title"
                placeholder="e.g. Professional Home Cleaning"
                value={form.title} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea className="form-input" name="description"
                placeholder="Describe what you offer, your experience, etc."
                value={form.description} onChange={handleChange} rows={4} required />
            </div>

            {/* Category Cards */}
            <div className="form-group">
              <label>Category</label>
              <div className="categories-grid" style={{ marginTop: '8px' }}>
                {CATEGORIES.map((cat) => (
                  <div key={cat.name}
                    className={`category-card ${form.category === cat.name ? 'selected' : ''}`}
                    onClick={() => setForm({ ...form, category: cat.name })}
                    style={{ padding: '16px 12px' }}
                  >
                    <span className="category-icon" style={{ fontSize: '24px' }}>{cat.icon}</span>
                    <span className="category-name">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Price (₹)</label>
                <input className="form-input" type="number" name="price"
                  placeholder="500" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input className="form-input" type="text" name="address"
                  placeholder="Your service area" value={form.address} onChange={handleChange} required />
              </div>
            </div>

            {/* Map Location Picker */}
            <div className="form-group">
              <label>Location (click map or use button)</label>
              <div className="map-container" style={{ marginTop: '8px' }}>
                <MapContainer
                  center={[17.385, 78.4867]} zoom={12}
                  style={{ height: '250px', width: '100%' }}
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <LocationPicker onLocationSelect={handleMapClick} position={mapPosition} />
                </MapContainer>
              </div>
              <button type="button" onClick={getLocation} className="btn btn-secondary btn-block"
                style={{ marginTop: '10px' }}>
                📍 Use My Current Location
              </button>
              {form.latitude && (
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '6px' }}>
                  📌 Location set: {Number(form.latitude).toFixed(4)}, {Number(form.longitude).toFixed(4)}
                </p>
              )}
            </div>

            <div className="form-row" style={{ display: 'none' }}>
              <input type="number" name="latitude" value={form.latitude}
                onChange={handleChange} required />
              <input type="number" name="longitude" value={form.longitude}
                onChange={handleChange} required />
            </div>

            <button className="btn btn-primary btn-block btn-lg" type="submit"
              disabled={loading || !form.category} style={{ marginTop: '20px' }}>
              {loading ? '⏳ Publishing...' : '🚀 Publish Service'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddService;