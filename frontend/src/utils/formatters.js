export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '$0';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
    minimumFractionDigits: Number(amount) % 1 === 0 ? 0 : 2,
  }).format(Number(amount));
};

export const truncateText = (text, maxLength = 120) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const isValidLatitude = (lat) => {
  const num = Number(lat);
  return !isNaN(num) && num >= -90 && num <= 90;
};

export const isValidLongitude = (lng) => {
  const num = Number(lng);
  return !isNaN(num) && num >= -180 && num <= 180;
};

export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10;
};
