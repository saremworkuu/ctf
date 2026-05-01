import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
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

async function startServer() {
  const app = express();
  const PORT = 5000;

  // Middleware
  app.use(cors({
    origin: ['http://localhost:3000', 'http://localhost:5173'], // Support both for flexibility
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Authorization', 'Content-Type']
  }));
  app.use(express.json());

  // Database Connection
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticated_archive';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed. Make sure a MongoDB instance is running.');
    console.warn('⚠️ Error:', err instanceof Error ? err.message : String(err));
  }

  // API Routes
  app.get('/api/health', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.json({ 
      status: "Authenticated_Archive_Protocol v1.0", 
      db: isDbConnected ? 'connected' : 'disconnected',
      setup_required: !process.env.MONGODB_URI || !process.env.JWT_SECRET,
      message: isDbConnected ? "System operational." : "Critical: Database connection required. Ensure MONGODB_URI is set in environment secrets."
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/nfts', nftRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/users', userRoutes);

  // Swagger Documentation
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "Authenticated Archive Protocol API Documentation"
  }));

  // Health Check / Root
  app.get('/api', (req, res) => {
    res.json({ status: "Authenticated_Archive_Protocol v1.0" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
  });
}

startServer();
