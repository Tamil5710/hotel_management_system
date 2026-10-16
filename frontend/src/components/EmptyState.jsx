import React from 'react';
import { Building, SearchX, RotateCcw, PlusCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const EmptyState = ({
  title = 'No hotels found',
  description = 'We could not find any hotel listings matching your current search or filter criteria.',
  icon = 'search',
  onReset,
}) => {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        {icon === 'search' ? <SearchX size={32} /> : <Building size={32} />}
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        {onReset && (
          <button type="button" className="btn btn-primary btn-sm" onClick={onReset}>
            <RotateCcw size={14} />
            <span>Clear Filters</span>
          </button>
        )}
        <Link to="/hotels/new" className="btn btn-secondary btn-sm">
          <PlusCircle size={14} />
          <span>Add New Hotel</span>
        </Link>
      </div>
    </div>
  );
};

export default EmptyState;
