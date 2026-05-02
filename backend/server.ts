import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger.json';

// Routes
import authRoutes from './routes/auth.ts';
import nftRoutes from './routes/nfts.ts';
import cartRoutes from './routes/cart.ts';
import orderRoutes from './routes/orders.ts';
import userRoutes from './routes/users.ts';

dotenv.config();

const app = express();

async function startServer() {
  const PORT = process.env.PORT || 5000;

  // Middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173', 'https://ctf-hhav.onrender.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
  app.use(express.json());

  // Serve static images
  const imagesPath = path.join(process.cwd(), 'frontend', 'public', 'image');
  app.use('/image', express.static(imagesPath));
  app.use('/image', express.static(path.join(process.cwd(), 'public', 'image')));

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticated_archive';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed.');
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.json({
      status: "Authenticated_Archive_Protocol v1.0",
      db: isDbConnected ? 'connected' : 'disconnected'
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/nfts', nftRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);

  // Swagger
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  // Vite / Static
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    let distPath = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(distPath)) {
      distPath = path.join(process.cwd(), '..', 'frontend', 'dist');
    }
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Only listen if not in a serverless environment
  if (process.env.NODE_ENV !== 'production' || process.env.RUN_STANDALONE === 'true') {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  }
}

startServer();

export default app;
export { app };
