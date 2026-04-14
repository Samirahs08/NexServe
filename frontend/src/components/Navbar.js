import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path ? 'nav-link active' : 'nav-link';
  const initial = user.fullName ? user.fullName.charAt(0).toUpperCase() : '?';

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <Link to="/" className="navbar-brand">⚡ NexServe</Link>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className={isActive('/')}>Home</Link>

        {token ? (
          <>
            <Link to="/add-service" className={isActive('/add-service')}>Add Service</Link>
            {user.role === 'PROVIDER' && (
              <Link to="/my-services" className={isActive('/my-services')}>My Services</Link>
            )}
            <Link to="/my-bookings" className={isActive('/my-bookings')}>Bookings</Link>
            <Link to="/chat" className={isActive('/chat')}>Chat</Link>

            <div className="nav-user-info">
              <div className="nav-avatar">{initial}</div>
              <span className="nav-username">{user.fullName}</span>
            </div>
            {user.role === 'PROVIDER' && (
              <Link to="/edit-profile" className={isActive('/edit-profile')}>
                <button className="nav-btn nav-btn-outline">Profile</button>
              </Link>
            )}
            <button onClick={logout} className="nav-btn nav-btn-outline">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="nav-btn nav-btn-outline">Login</button>
            </Link>
            <Link to="/register">
              <button className="nav-btn nav-btn-primary">Get Started</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;