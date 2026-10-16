import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Building2, PlusCircle, Home, Menu, X, RotateCcw } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';
import SearchBar from './SearchBar';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const { filters, setSearchQuery, fetchHotels, resetHotelsToDefaults } = useHotels();

  const handleHeaderSearch = (query) => {
    setSearchQuery(query);
    fetchHotels();
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  const handleResetData = async () => {
    if (window.confirm('Reset all hotel listings to original defaults?')) {
      await resetHotelsToDefaults();
      fetchHotels();
      navigate('/');
    }
  };

  return (
    <header className="site-header" role="banner">
      <div className="container header-inner">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo" aria-label="Namala Hotels Home">
          <div className="brand-icon">
            <Building2 size={22} />
          </div>
          <div className="brand-text">
            <span className="brand-title">Madrid Hotels</span>
            <span className="brand-subtitle">Directory & Suites</span>
          </div>
        </Link>

        {/* Global Search Bar (Desktop) */}
        <div className="header-search">
          <SearchBar
            value={filters.search}
            onChange={(val) => setSearchQuery(val)}
            onSubmit={handleHeaderSearch}
            placeholder="Search hotels by name, city, or features..."
          />
        </div>

        {/* Desktop Navigation Links */}
        <nav className="header-nav" aria-label="Main Navigation">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <Home size={16} />
            <span>Home</span>
          </NavLink>

          <Link
            to="/hotels/new"
            className="btn btn-primary btn-sm"
            style={{ borderRadius: 'var(--radius-sm)' }}
          >
            <PlusCircle size={16} />
            <span>Add Hotel</span>
          </Link>
        </nav>

        {/* Mobile Hamburger Toggle */}
        <button
          type="button"
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-expanded={mobileMenuOpen}
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-nav-drawer container">
          <SearchBar
            value={filters.search}
            onChange={(val) => setSearchQuery(val)}
            onSubmit={(val) => {
              handleHeaderSearch(val);
              setMobileMenuOpen(false);
            }}
            placeholder="Search hotels..."
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <Home size={18} />
              <span>Explore All Hotels</span>
            </NavLink>

            <Link
              to="/hotels/new"
              className="btn btn-primary"
              onClick={() => setMobileMenuOpen(false)}
            >
              <PlusCircle size={18} />
              <span>Add New Hotel</span>
            </Link>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                handleResetData();
                setMobileMenuOpen(false);
              }}
            >
              <RotateCcw size={16} />
              <span>Reset Sample Data</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
