// Data persistence manager for Afrasia Uzbekistan
// Combines Initial Data with LocalAdmin Overrides so data is NEVER blank and 100% persistent

import { initialDb } from '../data/initialDbData';

const STORAGE_KEY = 'afrasia_db_store';

export const getStoredData = (key, fallback = null) => {
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
  return initialDb[key] || fallback || [];
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
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return {
      regions: (store.regions && store.regions.length > 0) ? store.regions : (initialDb.regions || []),
      cuisine: (store.cuisine && store.cuisine.length > 0) ? store.cuisine : (initialDb.cuisine || []),
      tours: (store.tours && store.tours.length > 0) ? store.tours : (initialDb.tours || []),
      pageBanners: (store.pageBanners && Object.keys(store.pageBanners).length > 0) ? store.pageBanners : (initialDb.pageBanners || {}),
      instruments: (store.instruments && store.instruments.length > 0) ? store.instruments : (initialDb.instruments || []),
      phrases: (store.phrases && store.phrases.length > 0) ? store.phrases : (initialDb.phrases || []),
      homeFacts: (store.homeFacts && store.homeFacts.headline) ? store.homeFacts : (initialDb.homeFacts || {})
    };
  } catch (err) {
    return initialDb;
  }
};

export const setAllStoredDB = (dbObj) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dbObj));
  } catch (err) {
    console.error("Storage save all error:", err);
  }
};
