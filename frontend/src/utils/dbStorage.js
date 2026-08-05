// Data persistence manager for Afrasia Uzbekistan
// Combines Initial Data with LocalAdmin Overrides so data is NEVER 0/blank

import { initialDb } from '../data/initialDbData';

const STORAGE_KEY = 'afrasia_db_store';
const VERSION_KEY = 'afrasia_db_version';
const CURRENT_VERSION = 'v2'; // Bumped to force clear old single-language data

export const getStoredData = (key, fallback = null) => {
  try {
    const ver = localStorage.getItem(VERSION_KEY);
    if (ver !== CURRENT_VERSION) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      return initialDb[key] || fallback || [];
    }
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
    const getValidList = (key) => {
      if (store[key] && Array.isArray(store[key]) && store[key].length > 0) {
        return store[key];
      }
      return initialDb[key] || [];
    };
    const getValidObj = (key) => {
      if (store[key] && typeof store[key] === 'object' && Object.keys(store[key]).length > 0) {
        return store[key];
      }
      return initialDb[key] || {};
    };

    return {
      regions: getValidList('regions'),
      cuisine: getValidList('cuisine'),
      tours: getValidList('tours'),
      pageBanners: getValidObj('pageBanners'),
      instruments: getValidList('instruments'),
      phrases: getValidList('phrases'),
      homeFacts: getValidObj('homeFacts')
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
