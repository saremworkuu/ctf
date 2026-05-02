const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// Mock/Import routes manually if needed, but for Vercel, let's keep it simple
const app = express();

app.use(cors());
app.use(express.json());

// For Vercel, we might want to just include the logic here if it's crashing
// But let's try to fix the existing structure first by being very explicit with paths

app.get('/api/health', (req, res) => {
  res.json({ status: "ok", env: process.env.NODE_ENV });
});

// Redirect to the main backend server.ts but as a JS function
const server = require('../backend/server.ts');
module.exports = server.default || server;
