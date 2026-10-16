
import React, { useState, useEffect } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp, Search } from 'lucide-react';
import { useHotels } from '../hooks/useHotels';

const FilterSidebar = ({ ratingFilter, onRatingChange, brandFilter, onBrandChange, brands = [] }) => {
  const {
    filters,
    setPriceFilters,
    clearFilters,
    fetchHotels,
    setSearchQuery,
  } = useHotels();

  const [minPrice, setMinPrice] = useState(filters.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || '');
  const [searchVal, setSearchVal] = useState(filters.search || '');

  const [openSections, setOpenSections] = useState({
    search: true,
    price: true,
    rating: true,
    brand: true,
  });

  useEffect(() => {
    setMinPrice(filters.minPrice || '');
    setMaxPrice(filters.maxPrice || '');
    setSearchVal(filters.search || '');
  }, [filters.minPrice, filters.maxPrice, filters.search]);

  const toggleSection = (section) => {
    setOpenSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();

    setSearchQuery(searchVal);
    setPriceFilters({ minPrice, maxPrice });
    fetchHotels();
  };

  const handleClearAll = () => {
    setMinPrice('');
    setMaxPrice('');
    setSearchVal('');
    clearFilters();
    onRatingChange?.('');
    onBrandChange?.('');
    fetchHotels();
  };

  const hasActiveFilters =
    filters.search || filters.minPrice || filters.maxPrice || ratingFilter || brandFilter;

  return (
    <aside className="filter-sidebar" aria-label="Hotel Filters">
      <div className="sidebar-header">
        <span className="sidebar-title">
          <Filter size={18} color="#000000" aria-hidden="true" />
          Filter Stays
        </span>

        {hasActiveFilters && (
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={handleClearAll}
            title="Reset active filters"
            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
          >
            <RotateCcw size={12} />
            Reset
          </button>
        )}
      </div>

      <form onSubmit={handleApplyFilters}>
        {/* Search Hotel */}
        <div className="sidebar-section">
          <div
            className="section-title"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('search')}
          >
            <span>Search Hotel</span>
            {openSections.search ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>

          {openSections.search && (
            <div style={{ marginTop: '8px' }}>
              <div className="price-input-wrapper">
                <Search
                  size={15}
                  className="price-currency-symbol"
                  style={{ left: '0.6rem' }}
                />
                <input
                  type="text"
                  placeholder="e.g. Palace, Beach..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  style={{ paddingLeft: '2rem' }}
                  aria-label="Filter by hotel title"
                />
              </div>
            </div>
          )}
        </div>


        {/* Price Range */}
        <div className="sidebar-section">
          <div
            className="section-title"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              cursor: 'pointer',
            }}
            onClick={() => toggleSection('price')}
          >
            <span>Price Range (₹)</span>
            {openSections.price ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </div>

          {openSections.price && (
            <div>
              <div className="price-inputs-row">
                <div className="price-input-group">
                  <label htmlFor="filter-min-price">Min Price</label>
                  <div className="price-input-wrapper">
                    <span className="price-currency-symbol">₹</span>
                    <input
                      id="filter-min-price"
                      type="number"
                      placeholder="0"
                      min="0"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                  </div>
                </div>

                <div className="price-input-group">
                  <label htmlFor="filter-max-price">Max Price</label>
                  <div className="price-input-wrapper">
                    <span className="price-currency-symbol">₹</span>
                    <input
                      id="filter-max-price"
                      type="number"
                      placeholder="500"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="filter-actions-group">
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  style={{ width: '100%' }}
                >
                  Apply Filters
                </button>

                {(minPrice || maxPrice || searchVal || ratingFilter || brandFilter) && (
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={handleClearAll}
                    style={{ width: '100%' }}
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
        {/* Guest rating */}
        <div className="sidebar-section">
          <button type="button" className="section-title filter-section-toggle" onClick={() => toggleSection('rating')} aria-expanded={openSections.rating}>
            <span>Guest rating</span>
            {openSections.rating ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.rating && (
            <div className="rating-filter-options">
              {[5, 4, 3, 2].map((rating) => (
                <label className={`rating-filter-option ${Number(ratingFilter) === rating ? 'selected' : ''}`} key={rating}>
                  <input type="radio" name="hotel-rating" checked={Number(ratingFilter) === rating} onChange={() => onRatingChange(String(rating))} />
                  <span className="filter-stars" aria-label={`${rating} stars`}><span className="filled-stars">{'★'.repeat(rating)}</span><span className="empty-stars">{'★'.repeat(5 - rating)}</span></span>
                  <span>{rating}+ stars</span>
                </label>
              ))}
              <label className="rating-filter-option">
                <input type="radio" name="hotel-rating" checked={!ratingFilter} onChange={() => onRatingChange('')} />
                <span>Any rating</span>
              </label>
            </div>
          )}
        </div>


        {/* Hotel brand */}
        <div className="sidebar-section">
          <button type="button" className="section-title filter-section-toggle" onClick={() => toggleSection('brand')} aria-expanded={openSections.brand}>
            <span>Hotel brand</span>
            {openSections.brand ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {openSections.brand && (
            <div className="brand-filter-options">
              <label className={`brand-filter-option ${!brandFilter ? 'selected' : ''}`}>
                <input type="radio" name="hotel-brand" checked={!brandFilter} onChange={() => onBrandChange('')} />
                <span>All brands</span>
              </label>
              {brands.map((brand) => (
                <label className={`brand-filter-option ${brandFilter === brand ? 'selected' : ''}`} key={brand}>
                  <input type="radio" name="hotel-brand" checked={brandFilter === brand} onChange={() => onBrandChange(brand)} />
                  <span>{brand}</span>
                </label>
              ))}
              {brands.length === 0 && <p className="filter-help-text">Brand options appear when hotel listings include a brand.</p>}
            </div>
          )}
        </div>


      </form>
    </aside>
  );
};

export default FilterSidebar;
