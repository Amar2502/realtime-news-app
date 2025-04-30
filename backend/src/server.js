// server.js
import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import newsroutes from './routes/newsroutes.js';
import config from './config/config.js';
import connectDB from './config/db.js';

const app = express();

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
  },
});

let userSocketMap = {};

// Store `io` in app context for use in controllers
app.set('io', io);

// Connect to the database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/news', newsroutes);

// Home route
app.get('/', (req, res) => {
  res.send('Server is Running');
});

// Socket.IO Logic
io.on('connection', (socket) => {
  console.log('🟢 Client connected:', socket.id);

  // Get username from the query parameter
  const { username } = socket.handshake.query;

  // Store username with socket id
  if (username) {
    userSocketMap[socket.id] = username;
    console.log(`User ${username} connected with socket ID ${socket.id}`);
  }

  // Subscribe to categories
  socket.on('subscribe', (category) => {
    socket.join(category);
    console.log(`✅ Subscribed ${socket.id} to room:`, category);
  });

  // Disconnect event
  socket.on('disconnect', () => {
    console.log('🔴 Client disconnected:', socket.id);

    // Remove user from the map when disconnected
    delete userSocketMap[socket.id];
  });
});

// Start the server
server.listen(config.PORT, () => {
  console.log('🚀 Server is Running on Port:', config.PORT);
});

export default app;
