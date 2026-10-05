import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE } from '../config/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const saved = localStorage.getItem('afrasia_jwt_token');
    const profile = localStorage.getItem('afrasia_user_profile');
    // Clear out only old mock test account if it was Marco Rossi
    if (profile && profile.includes('marco.rossi@gmail.com')) {
      localStorage.removeItem('afrasia_jwt_token');
      localStorage.removeItem('afrasia_user_profile');
      return null;
    }
    return saved || null;
  });

  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('afrasia_user_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.email === 'marco.rossi@gmail.com') {
          localStorage.removeItem('afrasia_user_profile');
          return null;
        }
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  });

  const [savedPlaces, setSavedPlaces] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('fav_places') || '[]');
    } catch {
      return [];
    }
  });

  const [bookings, setBookings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('afrasia_user_bookings') || '[]');
    } catch {
      return [];
    }
  });

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync token & user to localStorage and Axios default headers
  useEffect(() => {
    if (token) {
      localStorage.setItem('afrasia_jwt_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('afrasia_jwt_token');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('afrasia_user_profile', JSON.stringify(user));
    } else {
      localStorage.removeItem('afrasia_user_profile');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('fav_places', JSON.stringify(savedPlaces));
  }, [savedPlaces]);

  useEffect(() => {
    localStorage.setItem('afrasia_user_bookings', JSON.stringify(bookings));
  }, [bookings]);

  // Fetch current user from server on load if token exists
  useEffect(() => {
    if (token) {
      axios.get(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => {
        if (res.data && res.data.user) {
          setUser(res.data.user);
          localStorage.setItem('afrasia_user_profile', JSON.stringify(res.data.user));
          if (res.data.savedPlaces && res.data.savedPlaces.length > 0) {
            const placeIds = res.data.savedPlaces.map(s => s.placeId);
            setSavedPlaces(prev => Array.from(new Set([...prev, ...placeIds])));
          }
          if (res.data.bookings) {
            setBookings(res.data.bookings);
          }
        }
      })
      .catch((err) => {
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          logout();
        }
      });
    }
  }, [token]);

  // 1. Send OTP 6-Digit Code to Gmail for Registration
  const sendRegistrationCode = async ({ name, email, password, avatar, phone }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/send-code`, {
        name,
        email,
        password,
        avatar,
        phone
      });
      return { 
        success: true, 
        message: res.data?.message || "Tasdiqlash kodi emailingizga yuborildi.",
        email: res.data?.email || email,
        codePreview: res.data?.codePreview
      };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify 6-Digit Code and Finalize Registration
  const verifyRegistrationCode = async (email, code) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/verify-code`, {
        email,
        code
      });
      if (res.data && res.data.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true, message: res.data.message };
      }
      return { success: false, error: "Tasdiqlash amalga oshmadi." };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 3. Resend OTP Code
  const resendRegistrationCode = async (email) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/resend-code`, { email });
      return { 
        success: true, 
        message: res.data?.message || "Yangi kod yuborildi.",
        codePreview: res.data?.codePreview
      };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 4. Direct Email & Password Registration (Fallback)
  const registerWithEmail = async ({ name, email, password, avatar, phone }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, {
        name,
        email,
        password,
        avatar,
        phone
      });
      if (res.data && res.data.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'Kutilmagan javob qaytdi.' };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 5. Email & Password Login
  const loginWithEmail = async (email, password) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, {
        email,
        password
      });
      if (res.data && res.data.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'Kirish amalga oshmadi.' };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 6. Real Google OAuth Login (or GIS One Tap)
  const loginWithGoogle = async (credential, profile) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/google`, { credential, profile });
      if (res.data && res.data.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true };
      }
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  // 7. Instant Google Sign-in with user's genuine email & name
  const oneClickGoogleLogin = async (email, name, avatar) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_BASE}/api/auth/mock-google`, {
        email,
        name,
        avatar
      });
      if (res.data && res.data.accessToken) {
        setToken(res.data.accessToken);
        setUser(res.data.user);
        setAuthModalOpen(false);
        return { success: true };
      }
      return { success: false, error: 'Google orqali kirishda xatolik.' };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // 8. Update User Profile (Name, Avatar, Phone, Bio, Email)
  const updateUserProfile = async (profileData) => {
    setLoading(true);
    try {
      const res = await axios.put(`${API_BASE}/api/user/profile`, profileData, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      if (res.data && res.data.user) {
        setUser(res.data.user);
        localStorage.setItem('afrasia_user_profile', JSON.stringify(res.data.user));
        if (res.data.accessToken) {
          setToken(res.data.accessToken);
        }
        return { success: true, user: res.data.user };
      }
      return { success: false, error: "Profilni yangilashda xatolik." };
    } catch (err) {
      const msg = err.response?.data?.error || err.message;
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('afrasia_jwt_token');
    localStorage.removeItem('afrasia_user_profile');
  };

  const isPlaceSaved = (id) => {
    return savedPlaces.includes(id);
  };

  const toggleFavorite = async (placeId, placeType = 'place', itemData = null) => {
    const isCurrentlySaved = savedPlaces.includes(placeId);
    let updated;
    if (isCurrentlySaved) {
      updated = savedPlaces.filter(id => id !== placeId);
    } else {
      updated = [...savedPlaces, placeId];
    }
    setSavedPlaces(updated);

    if (token) {
      try {
        await axios.post(`${API_BASE}/api/user/favorites`, 
          { placeId, placeType, itemData },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) {}
    }
  };

  const addBooking = async (bookingData) => {
    const newBooking = {
      id: `bk_${Date.now()}`,
      bookingReference: `AFR-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      status: "CONFIRMED",
      ...bookingData
    };
    const nextBookings = [newBooking, ...bookings];
    setBookings(nextBookings);

    if (token) {
      try {
        await axios.post(`${API_BASE}/api/user/bookings`, bookingData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (e) {}
    }
    return newBooking;
  };

  const updateUserProgress = async (lessonId, xpGained = 15, score = 100) => {
    if (user) {
      const updatedUser = {
        ...user,
        xp: (user.xp || 0) + xpGained,
        streak: Math.max(1, user.streak || 1)
      };
      setUser(updatedUser);
    }

    if (token) {
      try {
        await axios.post(`${API_BASE}/api/user/progress`, 
          { lessonId, xpGained, score },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (e) {}
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      loading,
      authModalOpen,
      setAuthModalOpen,
      sendRegistrationCode,
      verifyRegistrationCode,
      resendRegistrationCode,
      registerWithEmail,
      loginWithEmail,
      loginWithGoogle,
      oneClickGoogleLogin,
      updateUserProfile,
      logout,
      savedPlaces,
      isPlaceSaved,
      toggleFavorite,
      bookings,
      addBooking,
      updateUserProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
