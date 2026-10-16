
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  Eye,
  Edit2,
  Trash2,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency, truncateText } from '../utils/formatters';

const DEFAULT_HOTEL_IMG =
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

const HotelCard = ({
  hotel,
  viewMode = 'list',
  onDeleteClick,
}) => {
  const [imgSrc, setImgSrc] = useState(
    hotel.imageUrl || DEFAULT_HOTEL_IMG
  );

  const handleImageError = () => {
    if (imgSrc !== DEFAULT_HOTEL_IMG) {
      setImgSrc(DEFAULT_HOTEL_IMG);
    }
  };

  const price = Number(hotel.price) || 0;
  const rating = Number(hotel.rating || 4.5);

  const originalPrice =
    Number(hotel.originalPrice) || Math.round(price * 1.25);

  const renderStars = () => {
    const fullStars = Math.floor(rating);

    return (
      <div className="rating-stars">
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            size={14}
            fill={index < fullStars ? '#FFD700' : 'none'}
            color="#FFD700"
            aria-hidden="true"
          />
        ))}
      </div>
    );
  };

  const renderPricing = () => (
    <div className="card-pricing-block">
      <div className="price-main">
        {formatCurrency(price)}
        <span className="price-period"> / night</span>
      </div>

      {originalPrice > price && (
        <span className="price-original">
          {formatCurrency(originalPrice)}
        </span>
      )}

      <span className="free-perk">Free cancellation</span>
    </div>
  );

  const renderActions = () => (
    <div className="card-secondary-btns">
      <Link
        to={`/hotels/${hotel.id}/edit`}
        className="btn btn-secondary btn-sm"
        title={`Edit ${hotel.title}`}
        aria-label={`Edit ${hotel.title}`}
      >
        <Edit2 size={13} />
        <span>Edit</span>
      </Link>

      <button
        type="button"
        className="btn btn-outline-danger btn-sm"
        onClick={() => onDeleteClick?.(hotel)}
        title={`Delete ${hotel.title}`}
        aria-label={`Delete ${hotel.title}`}
      >
        <Trash2 size={13} />
        <span>Delete</span>
      </button>
    </div>
  );

  const renderImage = (className) => (
    <div className={className}>
      <Link
        to={`/hotels/${hotel.id}`}
        tabIndex={-1}
        aria-hidden="true"
      >
        <img
          src={imgSrc}
          alt={hotel.altText || hotel.title || 'Hotel'}
          className="card-img"
          onError={handleImageError}
          loading="lazy"
        />
      </Link>

      {hotel.featured && (
        <span className="badge badge-primary card-badge-top">
          <ShieldCheck size={12} />
          Featured
        </span>
      )}
    </div>
  );

  // LIST VIEW
  if (viewMode === 'list') {
    return (
      <article
        className="hotel-card-list"
        aria-labelledby={`hotel-title-${hotel.id}`}
      >
        {renderImage('card-media')}

        <div className="card-content-center">
          <div>
            <Link
              to={`/hotels/${hotel.id}`}
              className="card-title-link"
              id={`hotel-title-${hotel.id}`}
            >
              {hotel.title}
            </Link>

            {/* Rating stars and score retained; review count removed */}
            <div className="rating-stars-row">
              {renderStars()}
              <span className="rating-score">
                {rating.toFixed(1)}
              </span>
            </div>

            <p className="card-description-snippet">
              {truncateText(hotel.description, 160)}
            </p>
          </div>

          <div className="card-location-row">
            <MapPin
              size={14}
              color="#000000"
              aria-hidden="true"
            />
            <span>
              {hotel.city ||
                `Coordinates: ${
                  Number(hotel.latitude).toFixed(3)
                }, ${
                  Number(hotel.longitude).toFixed(3)
                }`}
            </span>
          </div>
        </div>

        <div className="card-actions-right">
          {renderPricing()}

          <div className="card-buttons-stack">
            <Link
              to={`/hotels/${hotel.id}`}
              className="btn btn-primary btn-sm"
            >
              <Eye size={14} />
              <span>View Details</span>
            </Link>

            {renderActions()}
          </div>
        </div>
      </article>
    );
  }

  // GRID VIEW
  return (
    <article
      className="hotel-card-grid"
      aria-labelledby={`hotel-title-${hotel.id}`}
    >
      {renderImage('card-grid-media')}

      <div className="card-grid-body">
        <div
          className="card-location-row"
          style={{ marginBottom: '6px' }}
        >
          <MapPin
            size={13}
            color="#000000"
            aria-hidden="true"
          />
          <span>{hotel.city || 'Prime Location'}</span>
        </div>

        <Link
          to={`/hotels/${hotel.id}`}
          className="card-title-link"
          id={`hotel-title-${hotel.id}`}
        >
          {hotel.title}
        </Link>

        {/* Rating stars and score retained; review count removed */}
        <div className="rating-stars-row">
          {renderStars()}
          <span className="rating-score">
            {rating.toFixed(1)}
          </span>
        </div>

        <p
          className="card-description-snippet"
          style={{ WebkitLineClamp: 2 }}
        >
          {truncateText(hotel.description, 90)}
        </p>

        <div className="card-grid-pricing">
          <div
            className="price-main"
            style={{ fontSize: '1.25rem' }}
          >
            {formatCurrency(price)}
            <span className="price-period"> / night</span>
          </div>

          <span className="free-perk">Free cancel</span>
        </div>

        {originalPrice > price && (
          <span className="price-original">
            {formatCurrency(originalPrice)}
          </span>
        )}

        <div className="card-grid-actions">
          <Link
            to={`/hotels/${hotel.id}`}
            className="btn btn-primary btn-sm"
          >
            <Eye size={14} />
            <span>View Details</span>
          </Link>

          {renderActions()}
        </div>
      </div>
    </article>
  );
};

export default HotelCard;
