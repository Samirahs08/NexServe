import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import ServiceCard from '../components/ServiceCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const CATEGORIES = [
  { name: 'Cleaning', icon: '🧹', image: '/images/cat-cleaning.png' },
  { name: 'Plumbing', icon: '🔧', image: '/images/cat-plumbing.png' },
  { name: 'Electrical', icon: '⚡', image: '/images/cat-electrical.png' },
  { name: 'Carpentry', icon: '🪚', image: '/images/cat-carpentry.png' },
  { name: 'Painting', icon: '🎨', image: '/images/cat-painting.png' },
  { name: 'Tutoring', icon: '📚', image: '/images/cat-tutoring.png' },
  { name: 'Cooking', icon: '👨‍🍳', image: '/images/cat-cooking.png' },
  { name: 'Other', icon: '✨', image: '/images/cat-other.png' },
];

function Home() {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [userLocation, setUserLocation] = useState({ lat: 17.385, lng: 78.4867 });
  const [loading, setLoading] = useState(false);

  const fetchNearby = async (lat, lng) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/services/nearby?lat=${lat}&lng=${lng}`);
      setServices(res.data);
    } catch (err) {
      try {
        const res = await axios.get('http://localhost:8080/api/services');
        setServices(res.data);
      } catch (e) { console.error(e); }
    }
    setLoading(false);
  };

  const fetchByCategory = async (cat) => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/services/category/${cat}`);
      setServices(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const fetchBySearch = async () => {
    if (!search) return;
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8080/api/services/search?keyword=${search}`);
      setServices(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleCategoryClick = (cat) => {
    if (category === cat) {
      setCategory('');
      fetchNearby(userLocation.lat, userLocation.lng);
    } else {
      setCategory(cat);
      fetchByCategory(cat);
    }
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') fetchBySearch();
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });
        fetchNearby(lat, lng);
      },
      () => fetchNearby(17.385, 78.4867)
    );
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/images/hero-bg.png" alt="Service Platform" />
        </div>
        <div className="container">
          <div className="hero-content">
            <div className="hero-badge">
              <span className="dot"></span>
              Trusted by 1000+ customers
            </div>
            <h1>
              Find Expert <span className="gradient-text">Local Services</span> Near You
            </h1>
            <p>
              Connect with verified professionals in your neighborhood. From home repairs to
              tutoring, book trusted service providers with just a few clicks.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                🚀 Get Started Free
              </Link>
              <a href="#services" className="btn btn-secondary btn-lg">
                Browse Services
              </a>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <h3>500+</h3>
                <p>Active Services</p>
              </div>
              <div className="hero-stat">
                <h3>200+</h3>
                <p>Verified Providers</p>
              </div>
              <div className="hero-stat">
                <h3>50+</h3>
                <p>Cities Covered</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="section" id="categories">
        <div className="container">
          <div className="section-header">
            <h2>Browse by Category</h2>
            <p>Find the service you need from our wide range of professional categories</p>
          </div>
          <div className="cat-photo-grid">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                to={`/category/${cat.name}`}
                className="cat-photo-card"
              >
                <img src={cat.image} alt={cat.name} className="cat-photo-img" />
                <div className="cat-photo-overlay">
                  <span className="cat-photo-icon">{cat.icon}</span>
                  <span className="cat-photo-name">{cat.name}</span>
                  <span className="cat-photo-cta">View Services →</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="section" id="services" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="section-header">
            <h2>Services Near You</h2>
            <p>Discover top-rated professionals ready to help right in your area</p>
          </div>

          {/* Search */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search services by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              id="search-input"
            />
            <button className="btn btn-primary" onClick={fetchBySearch} id="search-btn">
              🔍 Search
            </button>
          </div>

          {/* Map */}
          <div className="map-container">
            <MapContainer
              center={[userLocation.lat, userLocation.lng]}
              zoom={13}
              style={{ height: '380px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {services.map((service) => (
                <Marker key={service.id} position={[service.latitude, service.longitude]}>
                  <Popup>
                    <strong>{service.title}</strong><br />
                    {service.category}<br />
                    ₹{service.price}<br />
                    {service.address}<br />
                    By: {service.providerName}
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Service Cards Grid */}
          {loading ? (
            <LoadingSpinner text="Finding services near you..." />
          ) : services.length > 0 ? (
            <div className="services-grid">
              {services.map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <span className="empty-state-icon">🔍</span>
              <h3>No services found</h3>
              <p>Try adjusting your search or browse a different category</p>
              <Link to="/add-service" className="btn btn-primary">Add a Service</Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;