export const initialHotels = [];

export const STORAGE_KEY = 'namala_hotels_data_v1';

export const loadStoredHotels = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (error) {
    console.warn('Could not read hotels from localStorage:', error);
  }

  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(initialHotels)
    );
  } catch (error) {
    console.warn('Could not initialize localStorage:', error);
  }

  return initialHotels;
};

export const saveStoredHotels = (hotels) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(hotels)
    );
  } catch (error) {
    console.error(
      'Failed to save hotels to localStorage:',
      error
    );
  }
};