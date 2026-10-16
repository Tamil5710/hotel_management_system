import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { hotelService } from '../../services/hotelService';

export const fetchHotels = createAsyncThunk(
  'hotels/fetchHotels',
  async (_, { getState, rejectWithValue }) => {
    try {
      const state = getState().hotels;
      const { search, minPrice, maxPrice, sortBy } = state.filters;
      const result = await hotelService.getHotels({
        search,
        minPrice,
        maxPrice,
        sortBy,
      });
      return result;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to fetch hotels');
    }
  }
);

export const fetchHotelById = createAsyncThunk(
  'hotels/fetchHotelById',
  async (id, { rejectWithValue }) => {
    try {
      const hotel = await hotelService.getHotelById(id);
      return hotel;
    } catch (err) {
      return rejectWithValue(err.message || `Failed to fetch hotel with ID ${id}`);
    }
  }
);

export const createHotel = createAsyncThunk(
  'hotels/createHotel',
  async (hotelData, { rejectWithValue }) => {
    try {
      const newHotel = await hotelService.createHotel(hotelData);
      return newHotel;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to create hotel');
    }
  }
);

export const updateHotel = createAsyncThunk(
  'hotels/updateHotel',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const updated = await hotelService.updateHotel(id, data);
      return updated;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to update hotel');
    }
  }
);

export const deleteHotel = createAsyncThunk(
  'hotels/deleteHotel',
  async (id, { rejectWithValue }) => {
    try {
      await hotelService.deleteHotel(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to delete hotel');
    }
  }
);

export const resetHotelsToDefaults = createAsyncThunk(
  'hotels/resetHotelsToDefaults',
  async (_, { rejectWithValue }) => {
    try {
      const defaults = await hotelService.resetToDefaults();
      return defaults;
    } catch (err) {
      return rejectWithValue(err.message || 'Failed to reset hotels');
    }
  }
);

const initialState = {
  items: [],
  totalCount: 0,
  selectedHotel: null,
  loading: false,
  detailsLoading: false,
  actionLoading: false,
  error: null,
  filters: {
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'default',
    viewMode: 'list',
  },
  pagination: {
    currentPage: 1,
    pageSize: 6,
  },
  toast: {
    visible: false,
    message: '',
    type: 'success',
  },
};

const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    setSearchQuery(state, action) {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1;
    },
    setPriceFilters(state, action) {
      const { minPrice, maxPrice } = action.payload;
      state.filters.minPrice = minPrice;
      state.filters.maxPrice = maxPrice;
      state.pagination.currentPage = 1;
    },
    clearFilters(state) {
      state.filters.search = '';
      state.filters.minPrice = '';
      state.filters.maxPrice = '';
      state.filters.sortBy = 'default';
      state.pagination.currentPage = 1;
    },
    setSortBy(state, action) {
      state.filters.sortBy = action.payload;
      state.pagination.currentPage = 1;
    },
    setViewMode(state, action) {
      state.filters.viewMode = action.payload;
    },
    setCurrentPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    setPageSize(state, action) {
      state.pagination.pageSize = action.payload;
      state.pagination.currentPage = 1;
    },
    clearSelectedHotel(state) {
      state.selectedHotel = null;
    },
    showToast(state, action) {
      state.toast = {
        visible: true,
        message: action.payload.message,
        type: action.payload.type || 'success',
      };
    },
    hideToast(state) {
      state.toast.visible = false;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.totalCount = action.payload.total;
      })
      .addCase(fetchHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchHotelById.pending, (state) => {
        state.detailsLoading = true;
        state.error = null;
      })
      .addCase(fetchHotelById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(fetchHotelById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(createHotel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items.unshift(action.payload);
        state.totalCount += 1;
        state.toast = {
          visible: true,
          message: `Hotel "${action.payload.title}" has been successfully added!`,
          type: 'success',
        };
      })
      .addCase(createHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
        state.toast = {
          visible: true,
          message: action.payload || 'Failed to create hotel',
          type: 'error',
        };
      });

    builder
      .addCase(updateHotel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updateHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        const index = state.items.findIndex((h) => String(h.id) === String(action.payload.id));
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.selectedHotel && String(state.selectedHotel.id) === String(action.payload.id)) {
          state.selectedHotel = action.payload;
        }
        state.toast = {
          visible: true,
          message: `Hotel "${action.payload.title}" updated successfully!`,
          type: 'success',
        };
      })
      .addCase(updateHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
        state.toast = {
          visible: true,
          message: action.payload || 'Failed to update hotel',
          type: 'error',
        };
      });

    builder
      .addCase(deleteHotel.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deleteHotel.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.items = state.items.filter((h) => String(h.id) !== String(action.payload));
        state.totalCount = Math.max(0, state.totalCount - 1);
        if (state.selectedHotel && String(state.selectedHotel.id) === String(action.payload)) {
          state.selectedHotel = null;
        }
        const maxPages = Math.ceil(state.items.length / state.pagination.pageSize) || 1;
        if (state.pagination.currentPage > maxPages) {
          state.pagination.currentPage = maxPages;
        }
        state.toast = {
          visible: true,
          message: 'Hotel record has been successfully deleted.',
          type: 'success',
        };
      })
      .addCase(deleteHotel.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload;
        state.toast = {
          visible: true,
          message: action.payload || 'Failed to delete hotel',
          type: 'error',
        };
      });

    builder
      .addCase(resetHotelsToDefaults.fulfilled, (state, action) => {
        state.items = action.payload;
        state.totalCount = action.payload.length;
        state.toast = {
          visible: true,
          message: 'Hotels reset to default sample records.',
          type: 'info',
        };
      });
  },
});

export const {
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
} = hotelSlice.actions;

export default hotelSlice.reducer;
