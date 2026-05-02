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

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type']
}));
app.use(express.json());

// ── Static Assets ───────────────────────────────────────────────────────────
const imagesPath = path.join(process.cwd(), 'frontend', 'public', 'image');
const rootImagesPath = path.join(process.cwd(), 'public', 'image');
app.use('/image', express.static(imagesPath));
app.use('/image', express.static(rootImagesPath));

// ── API Routes (Synchronous) ────────────────────────────────────────────────
const registerRoutes = (prefix: string) => {
  app.use(`${prefix}/auth`, authRoutes);
  app.use(`${prefix}/nfts`, nftRoutes);
  app.use(`${prefix}/cart`, cartRoutes);
  app.use(`${prefix}/orders`, orderRoutes);
  app.use(`${prefix}/users`, userRoutes);
};

// Register for both /api (local) and root (Vercel function)
registerRoutes('/api');
registerRoutes('');

app.get('/api/health', (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  res.json({
    status: "Authenticated_Archive_Protocol v1.0",
    db: isDbConnected ? 'connected' : 'disconnected'
  });
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ── Initialization ──────────────────────────────────────────────────────────
async function startServer() {
  const PORT = Number(process.env.PORT || 5000);
  const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticated_archive';
  
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('📦 Connected to MongoDB');
  } catch (err) {
    console.warn('⚠️ MongoDB connection failed.');
  }

  // Only mount Vite middleware when explicitly requested for local fullstack dev.
  // API deployments (Render) should not boot an internal Vite server.
  const enableViteMiddleware = process.env.ENABLE_VITE_DEV_SERVER === 'true';
  if (enableViteMiddleware && process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('❌ Failed to start server:', err);
  process.exit(1);
});

export default app;
export { app };
