const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const express = require('express');
const passport = require('passport');

const app = express();
const cors = require('cors');
const session = require('express-session');
const http = require('http');
const { Server } = require('socket.io');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    methods: ['GET', 'POST'],
    credentials: true
  }
});
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'], credentials: true })); // Allow both ports
app.use(express.json());

app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
}));

app.use(passport.initialize());
app.use(passport.session());

// MongoDB - Ensure connection to edupath database
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/edupath';
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB connected to:', MONGO_URI);
    // Verify connection to correct database
    const dbName = mongoose.connection.name;
    console.log('Connected to database:', dbName);
    
    // Check if the chats collection exists
    mongoose.connection.db.listCollections({name: 'chats'}).toArray((err, collections) => {
      if (err) {
        console.error('Error checking collections:', err);
      } else {
        if (collections.length === 0) {
          console.log('Warning: chats collection does not exist yet. It will be created when the first chat is saved.');
        } else {
          console.log('chats collection exists');
        }
      }
    });
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Health route
app.get('/health', (_req, res) => res.json({ ok: true }));

// Routes - support both legacy and new paths
// Auth
app.use('/api/auth', require('./routes/auth'));
app.use('/auth', require('./routes/auth')); // legacy alias

// Google OAuth
const googleAuth = require('./routes/googleAuth');
googleAuth.initializeGoogleStrategy(passport, process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);
app.use('/api/auth/google', googleAuth.router);
app.use('/auth/google', googleAuth.router); // legacy alias

// Chat API (router defines /chats and /chat endpoints)
const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);  // compatibility with older client calls
// app.use('/api/chats', chatRouter); // canonical

// Web scraping routes
app.use('/api/scraper', require('./routes/scraper'));

const PORT = process.env.PORT || 5000;

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);
  
  // Join a chat room
  socket.on('join_chat', (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });
  
  // Handle new messages
  socket.on('send_message', async (data) => {
    try {
      const { chatId, message, sender } = data;
      
      // Emit the message to all clients in the chat room
      io.to(chatId).emit('receive_message', {
        chatId,
        message,
        sender,
        timestamp: new Date()
      });
    } catch (error) {
      console.error('Error handling message:', error);
    }
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));