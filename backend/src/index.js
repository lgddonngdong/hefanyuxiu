import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import plantsRouter from './routes/plants.js';
import statsRouter from './routes/stats.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'plant-database-api',
    timestamp: new Date().toISOString(),
  });
});

// Routes
app.use('/api/plants', plantsRouter);
app.use('/api/stats', statsRouter);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    name: '黄河流域（河南段）自生植物数据库 API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      stats: '/api/stats',
      plants: '/api/plants',
      search: '/api/plants/search',
      recent: '/api/plants/recent',
      families: '/api/plants/families',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`🌿 Plant Database API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
});

export default app;
