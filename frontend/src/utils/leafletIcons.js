import L from 'leaflet';

export const fixLeafletMarkerIcon = () => {
  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:
      'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
};

export const createHotelMarkerIcon = (isFeatured = false) => {
  const color = isFeatured ? '#e11d48' : '#000000';
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="36" height="36">
      <path fill="${color}" stroke="#ffffff" stroke-width="1.5" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
      <circle cx="12" cy="9" r="3.2" fill="#ffffff"/>
      <path d="M10.8 7.8h2.4v2.4h-2.4z" fill="${color}"/>
    </svg>
  `;
  return L.divIcon({
    html: svg,
    className: 'custom-hotel-marker',
    iconSize: [36, 36],
    iconAnchor: [18, 36],
    popupAnchor: [0, -36],
  });
};
