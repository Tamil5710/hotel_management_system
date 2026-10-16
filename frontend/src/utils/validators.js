import { isValidLatitude, isValidLongitude } from './formatters';

const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export const validateImageFile = (file) => {
  if (!file) {
    return { valid: true };
  }

  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF).',
    };
  }

  if (file.size > MAX_IMAGE_SIZE_BYTES) {
    return {
      valid: false,
      error: 'Image file size exceeds 5MB limit. Please choose a smaller image.',
    };
  }

  return { valid: true };
};

export const validateHotelForm = (values) => {
  const errors = {};

  if (!values.title || !values.title.trim()) {
    errors.title = 'Hotel title is required.';
  } else if (values.title.trim().length < 3) {
    errors.title = 'Hotel title must be at least 3 characters long.';
  } else if (values.title.trim().length > 100) {
    errors.title = 'Hotel title must be 100 characters or fewer.';
  }

  if (!values.description || !values.description.trim()) {
    errors.description = 'Hotel description is required.';
  } else if (values.description.trim().length < 15) {
    errors.description = 'Description should be descriptive (at least 15 characters).';
  }

  if (values.latitude === '' || values.latitude === null || values.latitude === undefined) {
    errors.latitude = 'Latitude coordinate is required.';
  } else if (!isValidLatitude(values.latitude)) {
    errors.latitude = 'Latitude must be a valid number between -90 and 90.';
  }

  if (values.longitude === '' || values.longitude === null || values.longitude === undefined) {
    errors.longitude = 'Longitude coordinate is required.';
  } else if (!isValidLongitude(values.longitude)) {
    errors.longitude = 'Longitude must be a valid number between -180 and 180.';
  }

  if (values.price === '' || values.price === null || values.price === undefined) {
    errors.price = 'Price per night is required.';
  } else {
    const numPrice = Number(values.price);
    if (isNaN(numPrice)) {
      errors.price = 'Price must be a valid number.';
    } else if (numPrice <= 0) {
      errors.price = 'Price must be a positive number greater than 0.';
    }
  }

  if (!values.imageUrl && !values.imagePreview) {
    errors.imageUrl = 'Hotel image is required. Please upload an image or select a sample photo.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
