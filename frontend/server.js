import jsonServer from 'json-server';
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, 'db.json');

const server = express();

// 1. Enable CORS for all origins
server.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] }));

// 2. High capacity Body Parsers (100MB for image base64 & audio)
server.use(express.json({ limit: '100mb' }));
server.use(express.urlencoded({ limit: '100mb', extended: true }));

// 3. Custom Full Database PUT endpoint (/db) for instant backup restore & admin sync
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

// 4. Attach JSON Server router
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
  console.log(`JSON Server is running on port ${PORT} with 100MB payload support`);
});
