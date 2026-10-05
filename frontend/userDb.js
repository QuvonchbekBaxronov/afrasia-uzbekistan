import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.join(__dirname, 'database');
const usersFilePath = path.join(dbDir, 'users.json');
const mainDbPath = path.join(__dirname, 'db.json');

// Ensure database directory exists
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

export function getAllUsers() {
  try {
    if (fs.existsSync(usersFilePath)) {
      const raw = fs.readFileSync(usersFilePath, 'utf8');
      return JSON.parse(raw);
    }
    // If users.json not found, bootstrap from main db.json
    if (fs.existsSync(mainDbPath)) {
      const rawMain = fs.readFileSync(mainDbPath, 'utf8');
      const mainData = JSON.parse(rawMain);
      if (Array.isArray(mainData.users) && mainData.users.length > 0) {
        fs.writeFileSync(usersFilePath, JSON.stringify(mainData.users, null, 2), 'utf8');
        return mainData.users;
      }
    }
    return [];
  } catch (err) {
    console.error("userDb.getAllUsers error:", err);
    return [];
  }
}

export function saveAllUsers(users) {
  try {
    // 1. Write dedicated users.json
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2), 'utf8');

    // 2. Sync to main db.json users array (async/safely)
    try {
      if (fs.existsSync(mainDbPath)) {
        const rawMain = fs.readFileSync(mainDbPath, 'utf8');
        const mainData = JSON.parse(rawMain);
        mainData.users = users;
        fs.writeFileSync(mainDbPath, JSON.stringify(mainData, null, 2), 'utf8');
      }
    } catch (syncErr) {
      console.warn("Could not sync users to db.json:", syncErr.message);
    }
    return true;
  } catch (err) {
    console.error("userDb.saveAllUsers error:", err);
    return false;
  }
}

export function findUserByEmail(email) {
  if (!email) return null;
  const clean = email.toLowerCase().trim();
  const users = getAllUsers();
  return users.find(u => u.email?.toLowerCase().trim() === clean) || null;
}

export function findUserById(id) {
  if (!id) return null;
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
}

export function saveUser(newUser) {
  const users = getAllUsers();
  const existingIdx = users.findIndex(u => u.email?.toLowerCase() === newUser.email?.toLowerCase() || u.id === newUser.id);
  if (existingIdx >= 0) {
    users[existingIdx] = { ...users[existingIdx], ...newUser, updatedAt: new Date().toISOString() };
  } else {
    users.push(newUser);
  }
  saveAllUsers(users);
  return newUser;
}

export function updateUser(idOrEmail, updates) {
  const users = getAllUsers();
  const user = users.find(u => u.id === idOrEmail || u.email?.toLowerCase() === idOrEmail?.toLowerCase());
  if (!user) return null;

  Object.assign(user, updates, { updatedAt: new Date().toISOString() });
  saveAllUsers(users);
  return user;
}
