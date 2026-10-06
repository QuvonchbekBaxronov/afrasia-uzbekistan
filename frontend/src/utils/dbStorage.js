// Data persistence manager for Afrasia Uzbekistan
// Combines Initial Data with LocalAdmin Overrides so data is NEVER 0/blank

import { initialDb } from '../data/initialDbData';

const STORAGE_KEY = 'afrasia_db_store';
const VERSION_KEY = 'afrasia_db_version';
const CURRENT_VERSION = 'v5'; // Bumped to force clear cache and load new authentic Toshkent places & photos

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
      if (key === 'regions' && store[key].length < 14) {
        return initialDb.regions;
      }
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

export const cleanImageUrl = (rawUrl) => {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  let url = rawUrl.trim();

  // Strip brackets or quotes like @[...], [...], <...>, "...", '...'
  url = url.replace(/^@?\[(.*)\]$/, '$1').replace(/^<(.*)>$/, '$1').replace(/^["'](.*)["']$/, '$1').trim();

  // 1. Google imgres URL extraction:
  // e.g. https://www.google.com/imgres?q=...&imgurl=https%3A%2F%2Fexample.com%2Fphoto.jpg...
  if (url.includes('google.') && (url.includes('imgres') || url.includes('imgurl='))) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
      const imgurl = parsed.searchParams.get('imgurl');
      if (imgurl) {
        return decodeURIComponent(imgurl).trim();
      }
    } catch {
      const match = url.match(/[?&]imgurl=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    }
  }

  // 2. Google redirect / search URL:
  // e.g. https://www.google.com/url?sa=i&url=https%3A%2F%2F...
  if (url.includes('google.') && (url.includes('/url?') || url.includes('url='))) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
      const target = parsed.searchParams.get('url') || parsed.searchParams.get('q');
      if (target && (target.startsWith('http://') || target.startsWith('https://'))) {
        return decodeURIComponent(target).trim();
      }
    } catch {
      const match = url.match(/[?&](?:url|q)=([^&]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]).trim();
      }
    }
  }

  // 3. Yandex images redirect:
  if (url.includes('yandex.') && url.includes('img_url=')) {
    try {
      const parsed = new URL(url.startsWith('http') ? url : 'https://' + url);
      const imgUrl = parsed.searchParams.get('img_url');
      if (imgUrl) return decodeURIComponent(imgUrl).trim();
    } catch {}
  }

  return url;
};

export const saveStoredData = (key, value) => {
  try {
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    store[key] = value;
    store.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    try {
      window.dispatchEvent(new Event('storage'));
    } catch {}
    return true;
  } catch (err) {
    console.error("Storage write error:", err);
    return false;
  }
};

export const getAllStoredDB = () => {
  try {
    const store = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const getValidList = (key) => {
      if (store[key] && Array.isArray(store[key]) && store[key].length > 0) {
        if (key === 'regions' && store[key].length < 14) {
          return initialDb.regions;
        }
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
      homeFacts: getValidObj('homeFacts'),
      uzbekLessons: getValidList('uzbekLessons'),
      uzbekQuizzes: getValidList('uzbekQuizzes')
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
