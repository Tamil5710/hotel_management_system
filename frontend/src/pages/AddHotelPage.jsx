import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';
import HotelForm from '../components/HotelForm';

const AddHotelPage = () => {
  const navigate = useNavigate();
  const { createHotel, actionLoading } = useHotels();

  const handleAddHotel = async (formData) => {
    try {
      const resultAction = await createHotel(formData);
      if (createHotel.fulfilled.match(resultAction)) {
        navigate('/');
      }
    } catch (err) {
      console.error('Failed to create hotel:', err);
    }
  };

  return (
    <>
      <Helmet>
        <title>Madrid Hotels Directory</title>
        <meta
          name="description"
          content="Register a new hotel in the directory with images, pricing, location coordinates, and description."
        />
      </Helmet>

      <section className="hero-banner" aria-label="Add Hotel Header">
        <div className="container hero-banner-inner">
          <div>
            <h1>Register New Hotel</h1>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <span>Hotels</span>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <span>New Registration</span>
            </nav>
          </div>

          <Link
            to="/"
            className="btn btn-secondary btn-sm"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              color: '#000000',
              fontWeight: 600,
            }}
          >
            <ArrowLeft size={14} />
            <span>Back to Hotel Directory</span>
          </Link>
        </div>
      </section>

      <div className="container" style={{ padding: '2rem 1rem' }}>
        <HotelForm
          isEditMode={false}
          onSubmit={handleAddHotel}
          isSubmitting={actionLoading}
        />
      </div>
    </>
  );
};

export default AddHotelPage;
