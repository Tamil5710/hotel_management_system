import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  UploadCloud,
  X,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  MapPin,
  Compass,
  DollarSign,
  Save,
  RotateCcw,
} from 'lucide-react';
import { validateHotelForm, validateImageFile } from '../utils/validators';
import { hotelService } from '../services/hotelService';

const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

const SAMPLE_PRESET_IMAGES = [
  'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80',
  'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80'
];

const HotelForm = ({
  initialData = null,
  isEditMode = false,
  onSubmit,
  isSubmitting = false,
}) => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    city: '',
    latitude: '',
    longitude: '',
    price: '',
    imageUrl: '',
    altText: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        city: initialData.city || '',
        latitude: initialData.latitude !== undefined ? String(initialData.latitude) : '',
        longitude: initialData.longitude !== undefined ? String(initialData.longitude) : '',
        price: initialData.price !== undefined ? String(initialData.price) : '',
        imageUrl: initialData.imageUrl || '',
        altText: initialData.altText || '',
      });
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);

  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const updated = { ...formData, [name]: value, imagePreview };
      const { errors: newErrors } = validateHotelForm(updated);
      setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const { errors: newErrors } = validateHotelForm({ ...formData, imagePreview });
    setErrors((prev) => ({ ...prev, [name]: newErrors[name] }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const { valid, error } = validateImageFile(file);
    if (!valid) {
      setErrors((prev) => ({ ...prev, imageUrl: error }));
      return;
    }

    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      setImageFile(file);
      setImagePreview(dataUrl);
      setFormData((prev) => ({ ...prev, imageUrl: dataUrl }));
      setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    } catch {
      const objectUrl = URL.createObjectURL(file);
      setImageFile(file);
      setImagePreview(objectUrl);
      setFormData((prev) => ({ ...prev, imageUrl: objectUrl }));
      setErrors((prev) => ({ ...prev, imageUrl: undefined }));
    }
  };

  const handleRemoveImage = (e) => {
    e.stopPropagation();
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, imageUrl: '' }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectPresetImage = (url) => {
    setImageFile(null);
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setErrors((prev) => ({ ...prev, imageUrl: undefined }));
  };

  const handleFillCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setFormData((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setErrors((prev) => ({
          ...prev,
          latitude: undefined,
          longitude: undefined,
        }));
      },
      (err) => {
        alert(`Could not retrieve location: ${err.message}`);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setTouched({
      title: true,
      description: true,
      latitude: true,
      longitude: true,
      price: true,
      imageUrl: true,
    });

    const validation = validateHotelForm({
      ...formData,
      imagePreview,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      const firstErrorField = Object.keys(validation.errors)[0];
      const el = document.getElementById(`field-${firstErrorField}`);
      if (el) el.focus();
      return;
    }

    let finalImageUrl = formData.imageUrl;

    // Upload physical file if chosen from user's machine
    if (imageFile) {
      try {
        setIsUploading(true);
        finalImageUrl = await hotelService.uploadImage(imageFile);
      } catch (uploadErr) {
        setIsUploading(false);
        setErrors((prev) => ({
          ...prev,
          imageUrl: uploadErr.message || 'Image upload failed. Please try again.',
        }));
        return;
      } finally {
        setIsUploading(false);
      }
    }

    // Safety fallback: Never save ephemeral in-memory blob URLs
    if (finalImageUrl && finalImageUrl.startsWith('blob:')) {
      if (imageFile) {
        finalImageUrl = await fileToDataUrl(imageFile);
      } else {
        setErrors((prev) => ({
          ...prev,
          imageUrl: 'Please select a valid image.',
        }));
        return;
      }
    }

    const submissionPayload = {
      ...formData,
      imageUrl: finalImageUrl,
      price: Number(formData.price),
      latitude: Number(formData.latitude),
      longitude: Number(formData.longitude),
      altText: formData.altText || `View of ${formData.title}`,
      city: formData.city || 'Prime Destination',
    };

    onSubmit(submissionPayload);
  };

  return (
    <form className="form-card" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h2>{isEditMode ? 'Edit Hotel Details' : 'Add New Hotel'}</h2>
        <p>
          {isEditMode
            ? 'Update hotel information, coordinates, pricing, or replacement photos.'
            : 'Fill in the information below to register a new hotel in the directory.'}
        </p>
      </div>

      <div className="form-body">
        {/* 1. HOTEL IMAGE UPLOAD & PREVIEW */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-imageUrl">
            <span>
              Hotel Cover Image <span className="required-star">*</span>
            </span>
            <span className="form-help-text">Max 5MB (JPG, PNG, WebP)</span>
          </label>

          <input
            type="file"
            id="field-imageUrl"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: 'none' }}
          />

          {imagePreview ? (
            <div className="image-preview-box">
              <img
                src={imagePreview}
                alt={formData.title || 'Hotel preview'}
                className="image-preview-img"
              />
              <div style={{ position: 'absolute', top: 12, right: 12, display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className="image-preview-overlay-btn"
                  onClick={() => fileInputRef.current?.click()}
                  title="Replace with another file"
                >
                  <UploadCloud size={14} />
                  <span>Replace</span>
                </button>
                <button
                  type="button"
                  className="image-preview-overlay-btn"
                  onClick={handleRemoveImage}
                  style={{ backgroundColor: 'rgba(239, 68, 68, 0.85)' }}
                  title="Remove image"
                >
                  <X size={14} />
                  <span>Remove</span>
                </button>
              </div>
            </div>
          ) : (
            <div
              className={`image-dropzone ${errors.imageUrl ? 'is-invalid' : ''}`}
              onClick={() => fileInputRef.current?.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-light)',
                  color: 'var(--color-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <UploadCloud size={28} />
              </div>
              <div style={{ fontWeight: 600, color: '#000000' }}>
                Click to upload an image from your device
              </div>
              <p style={{ fontSize: '0.8rem', color: '#64748b' }}>
                Supports JPEG, PNG, or WebP up to 5MB
              </p>
            </div>
          )}

          {errors.imageUrl && (
            <div className="form-error-msg" role="alert">
              <AlertCircle size={14} />
              <span>{errors.imageUrl}</span>
            </div>
          )}

          <div style={{ marginTop: '8px' }}>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', marginBottom: '6px' }}>
              Or choose one of our sample high-res hotel photographs:
            </span>
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
              {SAMPLE_PRESET_IMAGES.map((sampleUrl, idx) => (
                <img
                  key={idx}
                  src={sampleUrl}
                  alt={`Preset option ${idx + 1}`}
                  onClick={() => handleSelectPresetImage(sampleUrl)}
                  style={{
                    width: 56,
                    height: 40,
                    borderRadius: '4px',
                    objectFit: 'cover',
                    cursor: 'pointer',
                    border: imagePreview === sampleUrl ? '2px solid var(--color-primary)' : '1px solid #cbd5e1',
                  }}
                  title="Click to use this photo"
                />
              ))}
            </div>
          </div>
        </div>

        {/* 2. HOTEL TITLE & LOCATION NAME */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="field-title">
              <span>
                Hotel Title <span className="required-star">*</span>
              </span>
            </label>
            <input
              id="field-title"
              name="title"
              type="text"
              className={`form-control ${errors.title ? 'is-invalid' : ''}`}
              placeholder="e.g. Royal Grand Palace Resort"
              value={formData.title}
              onChange={handleChange}
              onBlur={handleBlur}
              required
            />
            {errors.title && (
              <div className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="field-city">
              <span>City / Region</span>
              <span className="form-help-text">Optional</span>
            </label>
            <input
              id="field-city"
              name="city"
              type="text"
              className="form-control"
              placeholder="e.g. Mumbai, Maharashtra"
              value={formData.city}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 3. HOTEL DESCRIPTION */}
        <div className="form-group">
          <label className="form-label" htmlFor="field-description">
            <span>
              Hotel Description <span className="required-star">*</span>
            </span>
            <span className="form-help-text">Minimum 15 characters</span>
          </label>
          <textarea
            id="field-description"
            name="description"
            rows={4}
            className={`form-control ${errors.description ? 'is-invalid' : ''}`}
            placeholder="Describe the hotel amenities, ambiance, dining options, proximity to attractions, and guest accommodations..."
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            required
          />
          {errors.description && (
            <div className="form-error-msg" role="alert">
              <AlertCircle size={14} />
              <span>{errors.description}</span>
            </div>
          )}
        </div>

        {/* 4 & 5. LATITUDE AND LONGITUDE COORDINATES */}
        <div>
          <div className="coord-helper-bar" style={{ marginBottom: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
              <Compass size={14} color="#000000" />
              Location Coordinates (Map Pin Placement)
            </span>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleFillCurrentLocation}
              style={{ padding: '0.15rem 0.5rem', fontSize: '0.72rem' }}
              title="Use your browser GPS coordinates"
            >
              <MapPin size={12} />
              Use Current Location
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="field-latitude">
                <span>
                  Latitude <span className="required-star">*</span>
                </span>
                <span className="form-help-text">-90 to 90</span>
              </label>
              <input
                id="field-latitude"
                name="latitude"
                type="number"
                step="any"
                className={`form-control ${errors.latitude ? 'is-invalid' : ''}`}
                placeholder="e.g. 19.0760"
                value={formData.latitude}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.latitude && (
                <div className="form-error-msg" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.latitude}</span>
                </div>
              )}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="field-longitude">
                <span>
                  Longitude <span className="required-star">*</span>
                </span>
                <span className="form-help-text">-180 to 180</span>
              </label>
              <input
                id="field-longitude"
                name="longitude"
                type="number"
                step="any"
                className={`form-control ${errors.longitude ? 'is-invalid' : ''}`}
                placeholder="e.g. 72.8777"
                value={formData.longitude}
                onChange={handleChange}
                onBlur={handleBlur}
                required
              />
              {errors.longitude && (
                <div className="form-error-msg" role="alert">
                  <AlertCircle size={14} />
                  <span>{errors.longitude}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 6. PRICE PER NIGHT */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label" htmlFor="field-price">
              <span>
                Price Per Night (₹ Rupee) <span className="required-star">*</span>
              </span>
              <span className="form-help-text">Must be &gt; 0</span>
            </label>
            <div className="price-input-wrapper">
              <span className="price-currency-symbol"> ₹</span>
              <input
                id="field-price"
                name="price"
                type="number"
                min="1"
                step="any"
                className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                placeholder="e.g. 185"
                value={formData.price}
                onChange={handleChange}
                onBlur={handleBlur}
                style={{ paddingLeft: '1.8rem' }}
                required
              />
            </div>
            {errors.price && (
              <div className="form-error-msg" role="alert">
                <AlertCircle size={14} />
                <span>{errors.price}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="field-altText">
              <span>Image Alt Text</span>
              <span className="form-help-text">SEO & Accessibility</span>
            </label>
            <input
              id="field-altText"
              name="altText"
              type="text"
              className="form-control"
              placeholder="e.g. Front view of luxury hotel and private pool"
              value={formData.altText}
              onChange={handleChange}
            />
          </div>
        </div>
      </div>

      <div className="form-footer">
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => navigate(-1)}
          disabled={isSubmitting || isUploading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={isSubmitting || isUploading}
        >
          {isUploading ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              <span>Uploading Image...</span>
            </>
          ) : isSubmitting ? (
            <>
              <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save size={16} />
              <span>{isEditMode ? 'Update Hotel' : 'Save Hotel'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default HotelForm;
