import { useDispatch, useSelector } from 'react-redux';
import {
  fetchHotels,
  fetchHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
  resetHotelsToDefaults,
  setSearchQuery,
  setPriceFilters,
  clearFilters,
  setSortBy,
  setViewMode,
  setCurrentPage,
  setPageSize,
  clearSelectedHotel,
  showToast,
  hideToast,
  clearError,
} from '../features/hotels/hotelSlice';

export const useHotels = () => {
  const dispatch = useDispatch();
  const hotelState = useSelector((state) => state.hotels);

  return {
    ...hotelState,
    fetchHotels: () => dispatch(fetchHotels()),
    fetchHotelById: (id) => dispatch(fetchHotelById(id)),
    createHotel: (data) => dispatch(createHotel(data)),
    updateHotel: (id, data) => dispatch(updateHotel({ id, data })),
    deleteHotel: (id) => dispatch(deleteHotel(id)),
    resetHotelsToDefaults: () => dispatch(resetHotelsToDefaults()),
    setSearchQuery: (query) => dispatch(setSearchQuery(query)),
    setPriceFilters: (range) => dispatch(setPriceFilters(range)),
    clearFilters: () => dispatch(clearFilters()),
    setSortBy: (sort) => dispatch(setSortBy(sort)),
    setViewMode: (mode) => dispatch(setViewMode(mode)),
    setCurrentPage: (page) => dispatch(setCurrentPage(page)),
    setPageSize: (size) => dispatch(setPageSize(size)),
    clearSelectedHotel: () => dispatch(clearSelectedHotel()),
    showToast: (toast) => dispatch(showToast(toast)),
    hideToast: () => dispatch(hideToast()),
    clearError: () => dispatch(clearError()),
  };
};
