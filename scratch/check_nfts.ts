import mongoose from 'mongoose';
import NFT from '../backend/models/NFT.ts';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

async function checkDB() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticated_archive');
  const nfts = await NFT.find();
  console.log('NFTs in DB:');
  nfts.forEach(n => console.log(`- ${n.name}: ${n.image}`));
  process.exit(0);
}

checkDB();
