import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticated_archive';

async function testConnection() {
  console.log('Testing connection to:', MONGODB_URI);
  try {
    await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
    console.log('SUCCESS: Connected to MongoDB');
    process.exit(0);
  } catch (err) {
    console.error('FAILURE: Could not connect to MongoDB');
    console.error(err);
    process.exit(1);
  }
}

testConnection();
