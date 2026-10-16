import axios from 'axios';
import { initialHotels, loadStoredHotels, saveStoredHotels } from '../data/hotels';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected network error occurred';
    return Promise.reject(new Error(message));
  }
);

// Use the real Express/PostgreSQL API by default. Set VITE_USE_BACKEND=false only for local-only development.
const USE_BACKEND_API = import.meta.env.VITE_USE_BACKEND !== 'false';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const hotelService = {
  async getHotels(params = {}) {
    if (USE_BACKEND_API) {
      return await apiClient.get('/hotels', { params });
    }

    await delay();
    let hotels = loadStoredHotels();

    const {
      search = '',
      minPrice = '',
      maxPrice = '',
      sortBy = 'default',
    } = params;

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      hotels = hotels.filter(
        (h) =>
          h.title.toLowerCase().includes(q) ||
          (h.city && h.city.toLowerCase().includes(q)) ||
          h.description.toLowerCase().includes(q)
      );
    }

    if (minPrice !== '' && !isNaN(Number(minPrice))) {
      hotels = hotels.filter((h) => Number(h.price) >= Number(minPrice));
    }

    if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
      hotels = hotels.filter((h) => Number(h.price) <= Number(maxPrice));
    }

    if (sortBy === 'price-asc') {
      hotels.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-desc') {
      hotels.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'rating-desc') {
      hotels.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'title-asc') {
      hotels.sort((a, b) => a.title.localeCompare(b.title));
    }

    return {
      data: hotels,
      total: hotels.length,
    };
  },

  async getHotelById(id) {
    if (USE_BACKEND_API) {
      return await apiClient.get(`/hotels/${id}`);
    }

    await delay(150);
    const hotels = loadStoredHotels();
    const hotel = hotels.find((h) => String(h.id) === String(id));

    if (!hotel) {
      throw new Error(`Hotel with ID "${id}" was not found.`);
    }

    return hotel;
  },

  async createHotel(hotelData) {
    if (USE_BACKEND_API) {
      return await apiClient.post('/hotels', hotelData);
    }

    await delay(350);
    const hotels = loadStoredHotels();

    const newHotel = {
      ...hotelData,
      id: `hotel-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      price: Number(hotelData.price),
      latitude: Number(hotelData.latitude),
      longitude: Number(hotelData.longitude),
      rating: hotelData.rating || 4.5,
      reviewsCount: hotelData.reviewsCount || 1,
      createdAt: new Date().toISOString(),
      altText: hotelData.altText || `View of ${hotelData.title}`,
    };

    const updated = [newHotel, ...hotels];
    saveStoredHotels(updated);
    return newHotel;
  },

  async updateHotel(id, hotelData) {
    if (USE_BACKEND_API) {
      return await apiClient.put(`/hotels/${id}`, hotelData);
    }

    await delay(350);
    const hotels = loadStoredHotels();
    const index = hotels.findIndex((h) => String(h.id) === String(id));

    if (index === -1) {
      throw new Error(`Hotel with ID "${id}" was not found.`);
    }

    const updatedHotel = {
      ...hotels[index],
      ...hotelData,
      id: hotels[index].id,
      price: Number(hotelData.price),
      latitude: Number(hotelData.latitude),
      longitude: Number(hotelData.longitude),
      updatedAt: new Date().toISOString(),
    };

    hotels[index] = updatedHotel;
    saveStoredHotels(hotels);
    return updatedHotel;
  },

  async deleteHotel(id) {
    if (USE_BACKEND_API) {
      return await apiClient.delete(`/hotels/${id}`);
    }

    await delay(250);
    const hotels = loadStoredHotels();
    const filtered = hotels.filter((h) => String(h.id) !== String(id));

    if (filtered.length === hotels.length) {
      throw new Error(`Hotel with ID "${id}" not found.`);
    }

    saveStoredHotels(filtered);
    return { success: true, id };
  },

  async uploadImage(file) {
    if (!file) return '';

    if (USE_BACKEND_API) {
      const formData = new FormData();
      formData.append('image', file);
      const res = await apiClient.post('/uploads', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.imageUrl || res.url || '';
    }

    // In local-storage mock mode, convert file to persistent Base64 Data URL
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  },

  async resetToDefaults() {
    if (USE_BACKEND_API) {
      await apiClient.post('/hotels/reset');
      const response = await apiClient.get('/hotels');
      return Array.isArray(response) ? response : (response.data || []);
    }

    await delay(200);
    saveStoredHotels(initialHotels);
    return initialHotels;
  },
};
