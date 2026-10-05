import jsonServer from 'json-server';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { signToken, verifyToken } from './jwt.js';
import { evaluateWriting, evaluateSpeech } from './aiEvaluator.js';
import { duolingoUnitsData } from './src/data/duolingoCurriculum.js';
import { sendOtpEmail } from './emailService.js';
import { getAllUsers, saveAllUsers, findUserByEmail, findUserById, saveUser, updateUser } from './userDb.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

// Temporary in-memory cache for pending OTP verification requests
const pendingRegistrations = new Map();

const server = express();

// 1. Enable CORS for all origins and headers
server.use(cors({ 
  origin: '*', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 2. High capacity Body Parsers (100MB for image base64 & audio)
server.use(express.json({ limit: '100mb' }));
server.use(express.urlencoded({ limit: '100mb', extended: true }));

// Helpers to read/write db.json safely
function readDb() {
  try {
    const raw = fs.readFileSync(dbPath, 'utf8');
    const data = JSON.parse(raw);
    if (!data.users) data.users = [];
    if (!data.savedPlaces) data.savedPlaces = [];
    if (!data.tourBookings) data.tourBookings = [];
    if (!data.userProgress) data.userProgress = [];
    return data;
  } catch (err) {
    return { users: [], savedPlaces: [], tourBookings: [], userProgress: [] };
  }
}

function writeDb(data) {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error("Failed to write db.json:", err);
    return false;
  }
}

// Auth Middleware
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token mancante o non valido' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyToken(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Token scaduto o non valido' });
  }

  req.user = decoded;
  next();
}

// =========================================================================
// 1. GOOGLE OAUTH & AUTHENTICATION ENDPOINTS
// =========================================================================

// POST /api/auth/google — Verify and Login/Register with Google OAuth 2.0
server.post('/api/auth/google', (req, res) => {
  try {
    const { credential, profile } = req.body;
    let googleUser = profile;

    // If a JWT credential was sent from Google GIS (One Tap), decode base64 payload
    if (credential && !googleUser) {
      try {
        const payloadBase64 = credential.split('.')[1];
        const decoded = Buffer.from(payloadBase64, 'base64').toString('utf8');
        googleUser = JSON.parse(decoded);
      } catch (e) {
        console.warn("Could not decode raw Google credential:", e.message);
      }
    }

    if (!googleUser || (!googleUser.email && !googleUser.sub)) {
      return res.status(400).json({ error: 'Dati Google non validi' });
    }

    const email = googleUser.email || `user_${googleUser.sub}@gmail.com`;
    const name = googleUser.name || (email.split('@')[0]);
    const avatar = googleUser.picture || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80';
    const googleId = googleUser.sub || `google_${Date.now()}`;

    const db = readDb();
    let user = db.users.find(u => u.email === email || (u.googleId && u.googleId === googleId));

    if (!user) {
      // Create new User
      user = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        email,
        name,
        avatar,
        googleId,
        role: 'USER',
        locale: 'it',
        xp: 60,
        streak: 1,
        hearts: 5,
        savedPlaces: [],
        createdAt: new Date().toISOString()
      };
      db.users.push(user);
    } else {
      // Update avatar or name if changed
      user.name = name || user.name;
      user.avatar = avatar || user.avatar;
      user.lastLoginAt = new Date().toISOString();
    }

    writeDb(db);

    const tokenPayload = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role
    };

    const accessToken = signToken(tokenPayload, 7 * 24 * 3600); // 7 days
    const refreshToken = signToken({ id: user.id }, 30 * 24 * 3600); // 30 days

    return res.status(200).json({
      success: true,
      accessToken,
      refreshToken,
      user
    });
  } catch (err) {
    console.error("Auth Google Error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 1. GMAIL VERIFICATION (OTP) & REGISTRATION FLOW
// =========================================================================

// POST /api/auth/send-code — Send 6-digit OTP code to user's Gmail
server.post('/api/auth/send-code', async (req, res) => {
  try {
    const { email, name, password, avatar, phone = "" } = req.body;
    if (!email || !name || !password) {
      return res.status(400).json({ error: "Ism, email va parol kiritilishi shart." });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.includes('@')) {
      return res.status(400).json({ error: "Email manzili noto'g'ri kiritildi." });
    }

    // Check if user already exists
    const existing = findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: "Ushbu email bilan akkaunt allaqachon mavjud. Iltimos, tizimga kiring." });
    }

    // Generate 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Store in pending registration map with 10-minute expiry
    pendingRegistrations.set(cleanEmail, {
      code: otpCode,
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      phone: phone || '',
      expiresAt: Date.now() + 10 * 60 * 1000
    });

    // Send email via Gmail SMTP
    const emailResult = await sendOtpEmail(cleanEmail, name.trim(), otpCode);

    return res.status(200).json({
      success: true,
      message: `Tasdiqlash kodi ${cleanEmail} manziliga yuborildi.`,
      email: cleanEmail,
      codePreview: otpCode // Displayed for seamless test / sandbox offline verification
    });
  } catch (err) {
    console.error("send-code error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/verify-code — Verify 6-digit OTP and finalize account creation
server.post('/api/auth/verify-code', (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ error: "Email va tasdiqlash kodi kiritilishi shart." });
    }
    const cleanEmail = email.toLowerCase().trim();
    const cleanCode = code.toString().trim();

    const pending = pendingRegistrations.get(cleanEmail);
    if (!pending) {
      return res.status(400).json({ error: "Ro'yxatdan o'tish so'rovi topilmadi yoki muddati o'tgan. Iltimos, qayta ro'yxatdan o'ting." });
    }

    if (Date.now() > pending.expiresAt) {
      pendingRegistrations.delete(cleanEmail);
      return res.status(400).json({ error: "Tasdiqlash kodi muddati o'tib ketdi (10 daqiqa). Qayta kod oling." });
    }

    if (pending.code !== cleanCode) {
      return res.status(400).json({ error: "Tasdiqlash kodi noto'g'ri. Iltimos, xatni tekshirib qayta kiriting." });
    }

    // Code is valid! Create authentic user
    const newUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      name: pending.name,
      password: pending.password,
      avatar: pending.avatar,
      phone: pending.phone || '',
      bio: '',
      role: 'USER',
      xp: 50,
      streak: 1,
      hearts: 5,
      savedPlaces: [],
      isEmailVerified: true,
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);
    pendingRegistrations.delete(cleanEmail);

    const accessToken = signToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      role: newUser.role
    }, 7 * 24 * 3600);

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      message: "Akkaunt muvaffaqiyatli tasdiqlandi va ro'yxatdan o'tildi!",
      accessToken,
      user: userSafe
    });
  } catch (err) {
    console.error("verify-code error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/resend-code — Resend verification code
server.post('/api/auth/resend-code', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email kiritilishi shart." });
    const cleanEmail = email.toLowerCase().trim();

    let pending = pendingRegistrations.get(cleanEmail);
    if (!pending) {
      return res.status(400).json({ error: "Avval ro'yxatdan o'tish ma'lumotlarini kiriting." });
    }

    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    pending.code = newCode;
    pending.expiresAt = Date.now() + 10 * 60 * 1000;
    pendingRegistrations.set(cleanEmail, pending);

    await sendOtpEmail(cleanEmail, pending.name, newCode);

    return res.status(200).json({
      success: true,
      message: "Yangi tasdiqlash kodi emailingizga yuborildi.",
      codePreview: newCode
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/register — Direct Registration (Fallback)
server.post('/api/auth/register', (req, res) => {
  try {
    const { name, email, password, avatar, phone = "" } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Ism, email va parol kiritilishi shart." });
    }
    const cleanEmail = email.toLowerCase().trim();
    if (!cleanEmail.includes('@')) {
      return res.status(400).json({ error: "Email manzili noto'g'ri kiritildi." });
    }

    const existing = findUserByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: "Ushbu email bilan akkaunt allaqachon ro'yxatdan o'tgan. Iltimos, tizimga kiring." });
    }

    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');
    const newUser = {
      id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      email: cleanEmail,
      name: name.trim(),
      password: hashedPassword,
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name.trim())}`,
      phone: phone || '',
      bio: '',
      role: 'USER',
      xp: 50,
      streak: 1,
      hearts: 5,
      savedPlaces: [],
      createdAt: new Date().toISOString()
    };

    saveUser(newUser);

    const accessToken = signToken({
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      avatar: newUser.avatar,
      role: newUser.role
    }, 7 * 24 * 3600);

    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({
      success: true,
      accessToken,
      user: userSafe
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/login — Email & Password Login
server.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email va parol kiritilishi shart." });
    }
    const cleanEmail = email.toLowerCase().trim();
    const user = findUserByEmail(cleanEmail);

    if (!user) {
      return res.status(401).json({ error: "Bunday email bilan akkaunt topilmadi. Avval ro'yxatdan o'ting." });
    }

    const hashedInput = crypto.createHash('sha256').update(password).digest('hex');
    if (user.password && user.password !== hashedInput) {
      return res.status(401).json({ error: "Parol noto'g'ri. Iltimos, qayta urinib ko'ring." });
    }

    updateUser(user.id, { lastLoginAt: new Date().toISOString() });

    const accessToken = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role
    }, 7 * 24 * 3600);

    const { password: _, ...userSafe } = user;
    return res.status(200).json({
      success: true,
      accessToken,
      user: userSafe
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// PUT /api/user/profile — Edit Name, Avatar, Phone, Bio, Email
server.put('/api/user/profile', authMiddleware, (req, res) => {
  try {
    const { name, avatar, phone, bio, email } = req.body;
    const user = findUserById(req.user.id) || findUserByEmail(req.user.email);

    if (!user) {
      return res.status(404).json({ error: "Foydalanuvchi topilmadi." });
    }

    const updates = {};
    if (name) updates.name = name.trim();
    if (avatar) updates.avatar = avatar;
    if (phone !== undefined) updates.phone = phone;
    if (bio !== undefined) updates.bio = bio;
    if (email && email.includes('@')) updates.email = email.toLowerCase().trim();

    const updatedUser = updateUser(user.id, updates);

    const accessToken = signToken({
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      avatar: updatedUser.avatar,
      role: updatedUser.role
    }, 7 * 24 * 3600);

    const { password: _, ...userSafe } = updatedUser;
    return res.status(200).json({
      success: true,
      accessToken,
      user: userSafe
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/auth/mock-google — Instant Google Login
server.post('/api/auth/mock-google', (req, res) => {
  try {
    const { email, name, avatar } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: "Yaroqli Google Gmail kiritilishi shart." });
    }
    const cleanEmail = email.toLowerCase().trim();
    const finalName = name?.trim() || cleanEmail.split('@')[0];
    const finalAvatar = avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(finalName)}`;
    
    let user = findUserByEmail(cleanEmail);
    if (!user) {
      user = {
        id: `usr_${Date.now()}`,
        email: cleanEmail,
        name: finalName,
        avatar: finalAvatar,
        googleId: `google_${Date.now()}`,
        role: "USER",
        xp: 60,
        streak: 1,
        hearts: 5,
        savedPlaces: [],
        createdAt: new Date().toISOString()
      };
      saveUser(user);
    } else {
      user = updateUser(user.id, {
        name: finalName || user.name,
        avatar: avatar || user.avatar,
        lastLoginAt: new Date().toISOString()
      });
    }

    const accessToken = signToken({
      id: user.id,
      email: user.email,
      name: user.name,
      avatar: user.avatar,
      role: user.role
    }, 7 * 24 * 3600);

    const { password: _, ...userSafe } = user;
    return res.status(200).json({
      success: true,
      accessToken,
      user: userSafe
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/auth/me — Get Current User Profile with stats, favorites, and bookings
server.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = findUserById(req.user.id) || findUserByEmail(req.user.email);
  if (!user) {
    return res.status(404).json({ error: 'Foydalanuvchi topilmadi' });
  }

  const db = readDb();
  const userSavedPlaces = (db.savedPlaces || []).filter(s => s.userId === user.id);
  const userBookings = (db.tourBookings || []).filter(b => b.userId === user.id || b.customerEmail === user.email);
  const userProgress = (db.userProgress || []).filter(p => p.userId === user.id);

  const { password: _, ...userSafe } = user;
  return res.status(200).json({
    user: userSafe,
    savedPlaces: userSavedPlaces,
    bookings: userBookings,
    progress: userProgress
  });
});


// =========================================================================
// 2. USER FAVORITES & BOOKINGS ENDPOINTS
// =========================================================================

// GET /api/user/favorites
server.get('/api/user/favorites', authMiddleware, (req, res) => {
  const db = readDb();
  const userFavs = (db.savedPlaces || []).filter(s => s.userId === req.user.id);
  return res.status(200).json({ favorites: userFavs });
});

// POST /api/user/favorites — Toggle Favorite
server.post('/api/user/favorites', authMiddleware, (req, res) => {
  const { placeId, placeType = 'place', itemData } = req.body;
  if (!placeId) return res.status(400).json({ error: 'placeId richiesto' });

  const db = readDb();
  const existingIdx = (db.savedPlaces || []).findIndex(
    s => s.userId === req.user.id && s.placeId === placeId
  );

  let isSaved = false;
  if (existingIdx >= 0) {
    db.savedPlaces.splice(existingIdx, 1);
    isSaved = false;
  } else {
    db.savedPlaces.push({
      id: `fav_${Date.now()}`,
      userId: req.user.id,
      placeId,
      placeType,
      itemData: itemData || null,
      createdAt: new Date().toISOString()
    });
    isSaved = true;
  }

  writeDb(db);
  return res.status(200).json({ success: true, isSaved, placeId });
});

// GET /api/user/bookings
server.get('/api/user/bookings', authMiddleware, (req, res) => {
  const db = readDb();
  const userBookings = (db.tourBookings || []).filter(
    b => b.userId === req.user.id || (req.user.email && b.customerEmail === req.user.email)
  );
  return res.status(200).json({ bookings: userBookings });
});

// POST /api/user/bookings — Create Tour Booking
server.post('/api/user/bookings', (req, res) => {
  try {
    const { 
      tourId, tourTitle, bookingDate, adults = 1, children = 0, 
      totalPrice, customerName, customerEmail, customerPhone, notes 
    } = req.body;

    if (!tourId || !bookingDate || !customerName) {
      return res.status(400).json({ error: 'Dati di prenotazione incompleti' });
    }

    const bookingReference = `AFR-${Math.floor(100000 + Math.random() * 900000)}`;
    const db = readDb();

    // Find user ID if bearer token provided
    let userId = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      const decoded = verifyToken(req.headers.authorization.split(' ')[1]);
      if (decoded) userId = decoded.id;
    }

    const newBooking = {
      id: `bk_${Date.now()}`,
      bookingReference,
      userId,
      tourId,
      tourTitle,
      bookingDate,
      adults: Number(adults),
      children: Number(children),
      totalPrice: Number(totalPrice),
      currency: "EUR",
      status: "CONFIRMED",
      customerName,
      customerEmail,
      customerPhone,
      notes: notes || null,
      createdAt: new Date().toISOString()
    };

    db.tourBookings.push(newBooking);
    writeDb(db);

    return res.status(201).json({
      success: true,
      booking: newBooking
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/user/progress — Save lesson progress and award XP
server.post('/api/user/progress', authMiddleware, (req, res) => {
  try {
    const { lessonId, xpGained = 15, score = 100 } = req.body;
    const db = readDb();

    const user = db.users.find(u => u.id === req.user.id);
    if (user) {
      user.xp = (user.xp || 0) + Number(xpGained);
      user.streak = Math.max(1, user.streak || 1);
    }

    const existingProgressIdx = db.userProgress.findIndex(
      p => p.userId === req.user.id && p.lessonId === lessonId
    );

    if (existingProgressIdx >= 0) {
      db.userProgress[existingProgressIdx].score = Math.max(db.userProgress[existingProgressIdx].score, score);
      db.userProgress[existingProgressIdx].updatedAt = new Date().toISOString();
    } else {
      db.userProgress.push({
        id: `prog_${Date.now()}`,
        userId: req.user.id,
        lessonId,
        score,
        isCompleted: true,
        completedAt: new Date().toISOString()
      });
    }

    writeDb(db);
    return res.status(200).json({ 
      success: true, 
      user: { xp: user?.xp, streak: user?.streak, hearts: user?.hearts } 
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 3. DUOLINGO CURRICULUM ENDPOINT
// =========================================================================
server.get('/api/duolingo/units', (req, res) => {
  return res.status(200).json({ units: duolingoUnitsData });
});

// =========================================================================
// 4. AI EVALUATION ENDPOINTS (Writing & Pronunciation)
// =========================================================================

// POST /api/ai/evaluate-writing
server.post('/api/ai/evaluate-writing', async (req, res) => {
  try {
    const prompt = req.body.prompt || req.body.prompt_it || '';
    const expected = req.body.expected || req.body.expectedAnswer || '';
    const user_input = req.body.user_input || req.body.userText || '';
    const language = req.body.language || 'it';
    const result = await evaluateWriting({ prompt, expected, user_input, language });
    return res.status(200).json(result);
  } catch (err) {
    console.error("AI writing evaluation error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/ai/evaluate-speech
server.post('/api/ai/evaluate-speech', async (req, res) => {
  try {
    const target_text = req.body.target_text || req.body.targetText || '';
    const recognized_text = req.body.recognized_text || req.body.spokenText || req.body.transcript || '';
    const language = req.body.language || 'it';
    const result = await evaluateSpeech({ target_text, recognized_text, language });
    return res.status(200).json(result);
  } catch (err) {
    console.error("AI speech evaluation error:", err);
    return res.status(500).json({ error: err.message });
  }
});


// 5. Custom Full Database PUT endpoint (/db) for instant backup restore & admin sync
server.put('/db', (req, res) => {
  try {
    const newData = req.body;
    if (newData && typeof newData === 'object') {
      fs.writeFileSync(dbPath, JSON.stringify(newData, null, 2), 'utf8');
      return res.status(200).json({ success: true, message: "Database updated successfully" });
    }
    return res.status(400).json({ error: "Invalid data format" });
  } catch (err) {
    console.error("DB update error:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 6. Attach JSON Server router
const router = jsonServer.router(dbPath);
const middlewares = jsonServer.defaults({ bodyParser: false });

server.use(middlewares);
server.use(router);

// Global Error Handler
server.use((err, req, res, next) => {
  console.error("Global Server Error:", err);
  res.status(500).json({ error: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Afrasia API Server running on port ${PORT} with Google Auth, Duolingo & AI Engine`);
});
