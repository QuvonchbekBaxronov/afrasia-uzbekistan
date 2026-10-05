#!/bin/bash

# Portlarni tozalash (agar band bo'lsa)
lsof -ti :3001 -ti :5173 | xargs kill -9 2>/dev/null || true

# Node va npm yo'llarini sozlash
export PATH="$HOME/.local/node/bin:$(cd "$(dirname "$0")" && pwd)/bin:$PATH"

echo "🚀 Afrasia loyihasi ishga tushirilmoqda..."
cd "$(dirname "$0")/frontend"

# Backend serverni fonda ishga tushirish (port 3001)
node server.js &
BACKEND_PID=$!
echo "✅ Backend (JSON Server) ishga tushdi: http://localhost:3001 (PID: $BACKEND_PID)"

# Frontend (Vite) serverini ishga tushirish (port 5173)
echo "✅ Frontend server ishga tushirilmoqda: http://localhost:5173"
trap "kill $BACKEND_PID 2>/dev/null" EXIT
node node_modules/vite/bin/vite.js --host
