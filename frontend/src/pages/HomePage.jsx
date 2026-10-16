import React, { useEffect, useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { LayoutList, LayoutGrid, PlusCircle, ArrowUpDown } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';
import HotelCard from '../components/HotelCard';
import FilterSidebar from '../components/FilterSidebar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import ConfirmDialog from '../components/ConfirmDialog';

const HomePage = () => {
  const {
    items,
    loading,
    actionLoading,
    filters,
    pagination,
    fetchHotels,
    deleteHotel,
    setSortBy,
    setViewMode,
    setCurrentPage,
    setPageSize,
    clearFilters,
  } = useHotels();

  const [ratingFilter, setRatingFilter] = useState('');
  const [brandFilter, setBrandFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    fetchHotels();
  }, []);

  const getBrand = (hotel) => String(hotel.brand || hotel.brandName || hotel.brand_name || hotel.chainName || hotel.chain_name || hotel.hotelBrand || hotel.hotel_brand || '').trim();
  const brands = useMemo(() => [...new Set(items.map(getBrand).filter(Boolean))].sort((a, b) => a.localeCompare(b)), [items]);
  const filteredHotels = useMemo(() => items.filter((hotel) => {
    const rating = Number(hotel.rating) || 0;
    const brand = getBrand(hotel);
    return (!ratingFilter || rating >= Number(ratingFilter)) && (!brandFilter || brand === brandFilter);
  }), [items, ratingFilter, brandFilter]);
  const paginatedHotels = useMemo(() => {
    const startIndex = (pagination.currentPage - 1) * pagination.pageSize;
    return filteredHotels.slice(startIndex, startIndex + pagination.pageSize);
  }, [filteredHotels, pagination.currentPage, pagination.pageSize]);

  const handleDeleteRequest = (hotel) => {
    setDeleteTarget(hotel);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteTarget) {
      await deleteHotel(deleteTarget.id);
      setIsConfirmOpen(false);
      setDeleteTarget(null);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmOpen(false);
    setDeleteTarget(null);
  };

  return (
    <>
      <Helmet>
        <title>Madrid Hotels | Explore Luxury, Heritage & Boutique Stays</title>
        <meta
          name="description"
          content="Browse premier hotel directory featuring luxury resorts, palaces, and scenic retreats. Filter by price, amenities, and location."
        />
        <meta property="og:title" content="Madrid Hotels Directory" />
        <meta
          property="og:description"
          content="Explore boutique and luxury stays with verified coordinates and reviews."
        />
      </Helmet>

      {/* Blue Subheader / Hero Banner (Reference Page 3 UI) */}
      <section className="hero-banner" aria-label="Directory Header">
        <div className="container hero-banner-inner">
          <div>
            <h1>Hotel Directory & Luxury Stays</h1>
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link to="/">Home</Link>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <span>Hotels</span>
              <span className="breadcrumbs-sep">&rsaquo;</span>
              <span>Directory</span>
            </nav>
          </div>

          <div className="hero-banner-actions">
            <Link
              to="/hotels/new"
              className="btn btn-secondary btn-sm"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                color: '#000000',
                borderColor: 'transparent',
                fontWeight: 700,
              }}
            >
              <PlusCircle size={15} />
              <span>Register New Hotel</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Listing & Filters Layout */}
      <div className="container">
        <div className="listing-layout">
          <FilterSidebar ratingFilter={ratingFilter} onRatingChange={(value) => { setRatingFilter(value); setCurrentPage(1); }} brandFilter={brandFilter} onBrandChange={(value) => { setBrandFilter(value); setCurrentPage(1); }} brands={brands} />

          <section aria-label="Hotels List">
            <div className="listing-top-bar">
              <div className="hotels-found-count">
                <strong>{filteredHotels.length}</strong> {filteredHotels.length === 1 ? 'hotel' : 'hotels'} found
                {filters.search && ` for "${filters.search}"`}
              </div>

              <div className="listing-controls">
                <div className="sort-select-wrapper">
                  <ArrowUpDown size={15} color="#64748b" aria-hidden="true" />
                  <select
                    className="sort-select"
                    value={filters.sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      fetchHotels();
                    }}
                    aria-label="Sort hotels"
                  >
                    <option value="default">Best match</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                  </select>
                </div>

                <div className="view-toggle-btns" role="group" aria-label="View format">
                  <button
                    type="button"
                    className={`view-toggle-btn ${filters.viewMode === 'list' ? 'active' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List view (Reference UI layout)"
                    aria-label="List view"
                    aria-pressed={filters.viewMode === 'list'}
                  >
                    <LayoutList size={16} />
                  </button>
                  <button
                    type="button"
                    className={`view-toggle-btn ${filters.viewMode === 'grid' ? 'active' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid view"
                    aria-label="Grid view"
                    aria-pressed={filters.viewMode === 'grid'}
                  >
                    <LayoutGrid size={16} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching hotels from directory..." />
            ) : filteredHotels.length === 0 ? (
              <EmptyState
                title="No hotels match your search"
                description={
                  filters.search || filters.minPrice || filters.maxPrice || ratingFilter || brandFilter
                    ? 'Try clearing or broadening your search parameters and price filters.'
                    : 'No hotel listings available in the directory yet. Click below to add the first hotel.'
                }
                icon="search"
                onReset={
                  filters.search || filters.minPrice || filters.maxPrice || ratingFilter || brandFilter
                    ? () => {
                        clearFilters();
                        setRatingFilter('');
                        setBrandFilter('');
                        fetchHotels();
                      }
                    : null
                }
              />
            ) : (
              <>
                <div
                  className={
                    filters.viewMode === 'grid'
                      ? 'hotels-container-grid'
                      : 'hotels-container-list'
                  }
                >
                  {paginatedHotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      viewMode={filters.viewMode}
                      onDeleteClick={handleDeleteRequest}
                    />
                  ))}
                </div>

                <Pagination
                  currentPage={pagination.currentPage}
                  totalItems={filteredHotels.length}
                  pageSize={pagination.pageSize}
                  onPageChange={(p) => setCurrentPage(p)}
                  onPageSizeChange={(s) => setPageSize(s)}
                />
              </>
            )}
          </section>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Delete Hotel Listing"
        message={
          deleteTarget
            ? `Are you sure you want to delete "${deleteTarget.title}"? This record will be permanently removed from the system.`
            : 'Are you sure you want to delete this hotel?'
        }
        confirmText="Yes, Delete"
        cancelText="Cancel"
        isProcessing={actionLoading}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default HomePage;
