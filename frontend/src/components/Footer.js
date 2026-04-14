import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="footer-brand">⚡ NexServe</div>
            <p className="footer-desc">
              Connecting you with trusted local service providers. From plumbing to tutoring,
              find the right professional for every need — right in your neighborhood.
            </p>
          </div>
          <div>
            <h4 className="footer-title">Platform</h4>
            <ul className="footer-links">
              <li><Link to="/">Browse Services</Link></li>
              <li><Link to="/add-service">List Your Service</Link></li>
              <li><Link to="/my-bookings">My Bookings</Link></li>
              <li><Link to="/chat">Messages</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Categories</h4>
            <ul className="footer-links">
              <li><Link to="/">Cleaning</Link></li>
              <li><Link to="/">Plumbing</Link></li>
              <li><Link to="/">Electrical</Link></li>
              <li><Link to="/">Painting</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="footer-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#contact">Contact Us</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} NexServe. Built with ❤️ for local communities.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
