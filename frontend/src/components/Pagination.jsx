import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
  currentPage = 1,
  totalItems = 0,
  pageSize = 6,
  onPageChange,
  onPageSizeChange,
}) => {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  if (totalItems === 0) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <nav className="pagination-wrapper" aria-label="Hotels pagination navigation">
      <div className="pagination-stats">
        Showing <strong>{startItem}</strong>–<strong>{endItem}</strong> of{' '}
        <strong>{totalItems}</strong> hotels
      </div>

      <div className="pagination-nav">
        <button
          type="button"
          className="page-btn"
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Go to previous page"
        >
          <ChevronLeft size={18} />
        </button>

        {getPageNumbers().map((item, idx) => {
          if (item === '...') {
            return (
              <span key={`dots-${idx}`} className="page-btn" style={{ border: 'none', background: 'transparent' }}>
                …
              </span>
            );
          }

          const pageNum = Number(item);
          const isActive = pageNum === currentPage;

          return (
            <button
              key={pageNum}
              type="button"
              className={`page-btn ${isActive ? 'active' : ''}`}
              onClick={() => onPageChange(pageNum)}
              aria-current={isActive ? 'page' : undefined}
              aria-label={`Page ${pageNum}`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          type="button"
          className="page-btn"
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Go to next page"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {onPageSizeChange && (
        <div className="page-size-selector">
          <label htmlFor="page-size-select">Show per page:</label>
          <select
            id="page-size-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            <option value={3}>3</option>
            <option value={6}>6</option>
            <option value={8}>8</option>
          </select>
        </div>
      )}
    </nav>
  );
};

export default Pagination;
