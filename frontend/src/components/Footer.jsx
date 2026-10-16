import React from 'react';
import { Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to Madrid Hotels exclusive travel offers!');
  };

  return (
    <footer className="site-footer" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-col">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <div
                style={{
                  backgroundColor: '#000000',
                  color: 'white',
                  padding: '6px',
                  borderRadius: '6px',
                  display: 'flex',
                }}
              >
                <Building2 size={20} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>
                MADRID HOTELS
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, maxWidth: '340px' }}>
              Premium hotel discovery, booking directory, and property management portal. Discover handpicked luxury palaces, beach resorts, and alpine retreats across the country.
            </p>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul className="footer-links">
              <li><Link to="/">Explore All Hotels</Link></li>
              <li><Link to="/hotels/new">Register New Property</Link></li>
              <li><a href="#deals">Seasonal Offers</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Support & Help</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#cancellation">Cancellation Policy</a></li>
              <li><a href="#terms">Terms & Privacy</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p className="footer-newsletter-text">
              Stay in touch with latest updates, seasonal discounts, and curated weekend getaways.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
