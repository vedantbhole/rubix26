import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { connectDB } from './config/db.js';
import plantRoutes from './routes/plantRoutes.js';
import mediaRoutes from './routes/mediaRoutes.js';
import generateRoutes from './routes/generateRoutes.js';
import authRoutes from './routes/authRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import ayurvedaRoutes from './routes/ayurvedaRoutes.js';
import ayushRoutes from './routes/ayushRoutes.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from parent directory (backend/.env)
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 5001;

console.log('Environment loaded from:', path.resolve(__dirname, '../.env'));
console.log('PLANTNET_API_KEY loaded:', !!process.env.PLANTNET_API_KEY);
if (!process.env.PLANTNET_API_KEY) {
  console.warn('⚠️ PLANTNET_API_KEY is missing! Identification features will fail.');
}

// Middleware
app.use(morgan('dev')); // Log requests to console
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5175', 'http://localhost:3000', 'http://localhost:5001'],
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/plants', plantRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/generate', generateRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/ayurveda', ayurvedaRoutes);
app.use('/api/ayush', ayushRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🌿 Plant API server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
