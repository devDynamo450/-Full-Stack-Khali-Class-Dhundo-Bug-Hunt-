require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const roomRoutes = require('./routes/rooms');

const app = express();
const httpServer = http.createServer(app);

// ─── Socket.io setup ─────────────────────────────────────────────────────────
const io = new Server(httpServer, {
  cors: { origin: '*', methods: ['GET', 'POST'] },
});

// Attach io to app so routes can emit events
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`❌ Client disconnected: ${socket.id}`));
});

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/rooms', roomRoutes);

app.get('/', (req, res) => {
  res.json({ status: 'OK', message: '🏫 Khali Class Dhundo API is running!' });
});

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use((err, req, res, next) => {
  console.error('[Error]', err.stack);
  res.status(500).json({ success: false, message: 'Unexpected error.' });
});

// ─── DB + Start ───────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected.');
    httpServer.listen(PORT, () => {
      console.log(`🚀 Server + WebSocket running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => { console.error('❌ MongoDB failed:', err.message); process.exit(1); });
