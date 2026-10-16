import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Navigation, MapPin, ExternalLink } from 'lucide-react';
import { fixLeafletMarkerIcon, createHotelMarkerIcon } from '../utils/leafletIcons';
import { calculateDistance, formatCurrency } from '../utils/formatters';

fixLeafletMarkerIcon();

const MapUpdater = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  }, [center, map]);
  return null;
};

const HotelMap = ({ hotel }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [distanceKm, setDistanceKm] = useState(null);
  const [geoError, setGeoError] = useState(null);
  const [calculatingGeo, setCalculatingGeo] = useState(false);

  const latitude = Number(hotel?.latitude || 0);
  const longitude = Number(hotel?.longitude || 0);
  const position = [latitude, longitude];

  const handleCalculateDistance = () => {
    if (!navigator.geolocation) {
      setGeoError('Geolocation API is not supported by your browser.');
      return;
    }

    setCalculatingGeo(true);
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const uLat = pos.coords.latitude;
        const uLng = pos.coords.longitude;
        setUserLocation({ lat: uLat, lng: uLng });
        const dist = calculateDistance(uLat, uLng, latitude, longitude);
        setDistanceKm(dist);
        setCalculatingGeo(false);
      },
      (err) => {
        setGeoError(err.message || 'Unable to retrieve your current location.');
        setCalculatingGeo(false);
      },
      { timeout: 10000 }
    );
  };

  const openInGoogleMaps = () => {
    window.open(
      `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className="map-card-wrapper">
      <div className="map-card-header">
        <h3>
          <MapPin size={18} color="#000000" aria-hidden="true" />
          Location & Surroundings
        </h3>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={openInGoogleMaps}
          title="Open in Google Maps"
          style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
        >
          <ExternalLink size={12} />
          <span>Open External</span>
        </button>
      </div>

      <div className="map-container-box">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={position} icon={createHotelMarkerIcon(hotel?.featured)}>
            <Popup>
              <div style={{ padding: '8px 10px', minWidth: '180px' }}>
                <strong style={{ fontSize: '13px', display: 'block', color: '#000000' }}>
                  {hotel?.title}
                </strong>
                <span style={{ fontSize: '12px', color: '#000000', fontWeight: 700, display: 'block', marginTop: '4px' }}>
                  {formatCurrency(hotel?.price)} / night
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '2px' }}>
                  {hotel?.city || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`}
                </span>
              </div>
            </Popup>
          </Marker>
          <MapUpdater center={position} />
        </MapContainer>
      </div>

      <div className="map-card-footer">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
          <div className="coords-display-pills">
            <span className="coord-pill">Lat: {latitude.toFixed(5)}</span>
            <span className="coord-pill">Lng: {longitude.toFixed(5)}</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm"
            onClick={handleCalculateDistance}
            disabled={calculatingGeo}
            style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem' }}
          >
            <Navigation size={13} />
            <span>{calculatingGeo ? 'Locating...' : 'Calculate Distance'}</span>
          </button>
        </div>

        {distanceKm !== null && (
          <div className="geolocation-distance-box">
            <span>
              Distance from your current position: <strong>{distanceKm.toLocaleString()} km</strong>
            </span>
          </div>
        )}

        {geoError && (
          <div style={{ fontSize: '0.75rem', color: '#dc2626' }}>
            {geoError}
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelMap;
