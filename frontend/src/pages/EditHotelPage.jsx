import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';
import HotelForm from '../components/HotelForm';
import LoadingSpinner from '../components/LoadingSpinner';

const EditHotelPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    selectedHotel,
    detailsLoading,
    actionLoading,
    error,
    fetchHotelById,
    updateHotel,
  } = useHotels();

  useEffect(() => {
    if (id) {
      fetchHotelById(id);
    }
  }, [id]);

  const handleUpdateHotel = async (formData) => {
    try {
      const resultAction = await updateHotel(id, formData);
      if (updateHotel.fulfilled.match(resultAction)) {
        navigate(`/hotels/${id}`);
      }
    } catch (err) {
      console.error('Failed to update hotel:', err);
    }
  };

  if (detailsLoading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <LoadingSpinner message="Loading hotel details for editing..." />
      </div>
    );
  }

  if (error || !selectedHotel) {
    return (
      <div className="container" style={{ padding: '4rem 1rem' }}>
        <div className="empty-state-box">
          <div className="empty-state-icon" style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}>
            <AlertCircle size={32} />
          </div>
          <h3>Hotel Not Found</h3>
          <p>{error || `We couldn't locate any hotel with ID: ${id}`}</p>
          <Link to="/" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>
            <ArrowLeft size={14} />
            <span>Back to Hotel Directory</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`Edit ${selectedHotel.title} | Namala Hotels`}</title>
        <meta
          name="description"
          content={`Update details, pricing, photos, and coordinates for ${selectedHotel.title}.`}
        />
      </Helmet>

      <section className="hero-banner" aria-label="Edit Hotel Header">
        <div className="container hero-banner-inner">
          <div>
            <h1>Edit Hotel Record</h1>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <Link to={`/hotels/${id}`}>{selectedHotel.title}</Link>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <span>Edit</span>
            </nav>
          </div>

          <Link
            to={`/hotels/${id}`}
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#000000',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            <span>Cancel & View Details</span>
          </Link>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        <HotelForm
          initialData={selectedHotel}
          isEditMode={true}
          onSubmit={handleUpdateHotel}
          isSubmitting={actionLoading}
        />
      </div>
    </>
  );
};

export default EditHotelPage;
