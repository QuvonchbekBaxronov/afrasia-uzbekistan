// Data persistence manager for Afrasia Uzbekistan
// Combines API data with LocalAdmin Overrides so edits are 100% persistent across reloads

const STORAGE_KEY = 'afrasia_db_store';

export const getStoredData = (key, fallback = []) => {
  try {
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    if (store[key] && Array.isArray(store[key]) && store[key].length > 0) {
      return store[key];
    }
    if (store[key] && typeof store[key] === 'object' && Object.keys(store[key]).length > 0) {
      return store[key];
    }
  } catch (err) {
    console.error("Storage read error:", err);
  }
  return fallback;
};

export const saveStoredData = (key, value) => {
  try {
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    store[key] = value;
    store.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error("Storage write error:", err);
  }
};

export const getAllStoredDB = () => {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (err) {
    return {};
  }
};

export const setAllStoredDB = (dbObj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbObj));
  } catch (err) {
    console.error("Storage save all error:", err);
  }
};
