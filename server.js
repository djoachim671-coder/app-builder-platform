const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const socketIO = require('socket.io');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('public'));

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Import Routes
const authRoutes = require('./routes/auth');
const appRoutes = require('./routes/apps');
const paymentRoutes = require('./routes/payments');
const aiRoutes = require('./routes/ai');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/apps', appRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/ai', aiRoutes);

// Server Setup
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Socket.io for Real-time Generation
const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);

  socket.on('start-generation', (data) => {
    socket.emit('generation-started', { status: 'generating' });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

module.exports = { app, io };