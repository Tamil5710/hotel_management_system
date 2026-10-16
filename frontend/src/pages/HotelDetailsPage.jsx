import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Edit2,
  Trash2,
  MapPin,
  Star,
  CheckCircle,
  Share2,
  Calendar,
  ShieldCheck,
  Compass,
  DollarSign,
  AlertCircle,
} from 'lucide-react';
import { useHotels } from '../hooks/useHotels';
import HotelMap from '../components/HotelMap';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/formatters';

const HotelDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedHotel,
    detailsLoading,
    actionLoading,
    error,
    fetchHotelById,
    deleteHotel,
  } = useHotels();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  useEffect(() => {
    if (id) {
      fetchHotelById(id);
    }
  }, [id]);

  const handleDelete = async () => {
    await deleteHotel(id);
    setIsDeleteOpen(false);
    navigate('/');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: selectedHotel?.title,
        text: selectedHotel?.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Hotel page link copied to clipboard!');
    }
  };

  if (detailsLoading) {
    return (
      <div className="container" style={{ padding: '6rem 1rem' }}>
        <LoadingSpinner message="Loading hotel details and interactive map..." />
      </div>
    );
  }

  if (error || !selectedHotel) {
    return (
      <div className="container" style={{ padding: '5rem 1rem' }}>
        <div className="empty-state-box">
          <div className="empty-state-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <AlertCircle size={32} />
          </div>
          <h3>Hotel Details Unavailable</h3>
          <p>{error || `No hotel record found for ID: ${id}`}</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Hotel Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  const rating = Number(selectedHotel.rating || 4.5);
  const reviewsCount = selectedHotel.reviewsCount || 120;
  const originalPrice = selectedHotel.originalPrice || Math.round(Number(selectedHotel.price) * 1.25);
  const amenities = selectedHotel.amenities || [
    'Free High-Speed WiFi',
    'Swimming Pool & Cabanas',
    'Fine Dining Restaurant',
    '24/7 Front Desk Concierge',
    'Air Conditioned Suites',
  ];

  return (
    <>
      <Helmet>
        <title>{`${selectedHotel.title} | Madrid Hotels Luxury Stays`}</title>
        <meta
          name="description"
          content={`${selectedHotel.title} in ${selectedHotel.city || 'prime destination'}. ${selectedHotel.description.slice(0, 150)}...`}
        />
        <meta property="og:title" content={selectedHotel.title} />
        <meta property="og:description" content={selectedHotel.description} />
        <meta property="og:image" content={selectedHotel.imageUrl} />
      </Helmet>

      <section className="hero-banner" aria-label="Hotel Detail Breadcrumbs">
        <div className="container hero-banner-inner">
          <div>
            <h1>{selectedHotel.title}</h1>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <Link to="/">Hotels</Link>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <span>{selectedHotel.title}</span>
            </nav>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/" className="btn btn-secondary btn-sm" style={{ backgroundColor: '#fff', color: '#1266f1' }}>
              <ArrowLeft size={14} />
              <span>Back to Hotels</span>
            </Link>
            <Link to={`/hotels/${id}/edit`} className="btn btn-primary btn-sm">
              <Edit2 size={14} />
              <span>Edit Hotel</span>
            </Link>
          </div>
        </div>
      </section>

      <div className="container details-page-wrapper">
        <div className="details-top-nav">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="badge badge-primary">
              <ShieldCheck size={13} />
              Verified Hotel
            </span>
            {selectedHotel.city && (
              <span className="badge badge-secondary">
                <MapPin size={13} />
                {selectedHotel.city}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleShare}
              title="Share hotel listing"
            >
              <Share2 size={14} />
              <span>Share</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-danger btn-sm"
              onClick={() => setIsDeleteOpen(true)}
              title="Delete this hotel record"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>
        </div>

        <div className="details-main-grid">
          <div className="details-card">
            <div className="details-hero-img-box">
              <img
                src={selectedHotel.imageUrl}
                alt={selectedHotel.altText || selectedHotel.title}
                className="details-hero-img"
              />
            </div>

            <div className="details-content-box">
              <div className="details-header-row">
                <div>
                  <h2 className="details-title">{selectedHotel.title}</h2>
                  <div className="rating-stars-row" style={{ marginTop: '6px' }}>
                    <div className="stars-container">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          fill={i < Math.floor(rating) ? '#FFD700' : 'none'}
                          color="#FFD700"
                        />
                      ))}
                    </div>
                    <span className="rating-score" style={{ fontSize: '1rem' }}>
                      {rating.toFixed(1)}
                    </span>
                  </div>
                </div>

                <div className="details-pricing-badge">
                  <div className="details-price">
                    {formatCurrency(selectedHotel.price)}
                    <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b' }}>
                      {' '}
                      / night
                    </span>
                  </div>
                  {originalPrice > selectedHotel.price && (
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8', textDecoration: 'line-through' }}>
                      {formatCurrency(originalPrice)}
                    </div>
                  )}
                  <span className="free-perk" style={{ display: 'block', marginTop: '2px' }}>
                    Free cancellation available
                  </span>
                </div>
              </div>

              <div className="details-specs-grid">
                <div className="spec-item">
                  <div className="spec-icon">
                    <Compass size={18} />
                  </div>
                  <div>
                    <div className="spec-label">Coordinates</div>
                    <div className="spec-val">
                      {Number(selectedHotel.latitude).toFixed(3)}, {Number(selectedHotel.longitude).toFixed(3)}
                    </div>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon">
                    <span className="text-lg">₹</span>
                  </div>
                  <div>
                    <div className="spec-label">Rate per Night</div>
                    <div className="spec-val">{formatCurrency(selectedHotel.price)}</div>
                  </div>
                </div>

                <div className="spec-item">
                  <div className="spec-icon">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <div className="spec-label">Added On</div>
                    <div className="spec-val">
                      {selectedHotel.createdAt
                        ? new Date(selectedHotel.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : 'Verified Stay'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="details-description-section" style={{ marginBottom: '2rem' }}>
                <h3>About This Property And Amenities & Highlights</h3>
                <p className="details-description-text">{selectedHotel.description}</p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {amenities.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #edf2f7',
                        fontSize: '0.875rem',
                        color: '#334155',
                      }}
                    >
                      <CheckCircle size={15} color="#00b74a" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="details-sidebar-card">
            <HotelMap hotel={selectedHotel} />

            <div
              style={{
                backgroundColor: 'white',
                border: '1px solid var(--border-color-light)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                boxShadow: 'var(--shadow-xs)',
              }}
            >
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px' }}>
                Manage This Property
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                Need to adjust room rates, description, photos, or geographic pin?
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link to={`/hotels/${id}/edit`} className="btn btn-primary" style={{ width: '100%' }}>
                  <Edit2 size={16} />
                  <span>Edit Hotel Details</span>
                </Link>
                <Link to="/" className="btn btn-secondary" style={{ width: '100%' }}>
                  <ArrowLeft size={16} />
                  <span>Return to All Hotels</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isDeleteOpen}
        title="Delete Hotel Listing"
        message={`Are you sure you want to delete "${selectedHotel.title}"? This hotel listing will be permanently removed.`}
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isProcessing={actionLoading}
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      />
    </>
  );
};

export default HotelDetailsPage;
