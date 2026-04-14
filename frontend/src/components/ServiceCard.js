import React from 'react';
import { Link } from 'react-router-dom';

function ServiceCard({ service }) {
  return (
    <Link to={`/service/${service.id}`} style={{ textDecoration: 'none' }}>
      <div className="service-card">
        <img
          className="service-card-img"
          src="/images/service-placeholder.png"
          alt={service.title}
          loading="lazy"
        />
        <div className="service-card-body">
          <div className="service-card-header">
            <h3 className="service-card-title">{service.title}</h3>
            <span className="category-badge">{service.category}</span>
          </div>
          <p className="service-card-desc">{service.description}</p>
          <div className="service-card-meta">
            <span>📍 {service.address}</span>
            <span>👤 {service.providerName}</span>
          </div>
          <div className="service-card-footer">
            <span className="service-price">₹{service.price}</span>
            <span className="btn btn-sm btn-primary">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default ServiceCard;
