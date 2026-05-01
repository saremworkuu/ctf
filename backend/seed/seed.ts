import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from '../models/User.ts';
import NFT from '../models/NFT.ts';
import Order from '../models/Order.ts';
import CartItem from '../models/CartItem.ts';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/authenticated_archive';

const seedData = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('🌱 Connected to MongoDB for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await NFT.deleteMany({});
    await Order.deleteMany({});
    await CartItem.deleteMany({});

    console.log('🧹 Cleared existing data');

    // Seed Users
    const adminPass = await bcrypt.hash('adminpass', 10);
    const playerPass = await bcrypt.hash('password123', 10);
    const alicePass = await bcrypt.hash('alice123', 10);

    const users = [
      { userId: 1, username: 'admin', email: 'admin@archive.protocol', password: adminPass, role: 'admin', archiveSignature: '0xADM1N1337_SIGNED_v1' },
      { userId: 42, username: 'player', email: 'player@example.com', password: playerPass, role: 'user', archiveSignature: '0xPLAY3R0042_AGENT_ALPHA' },
      { userId: 43, username: 'alice', email: 'alice@example.com', password: alicePass, role: 'user', archiveSignature: '0xAL1CE0043_SECTOR_7' },
    ];

    await User.insertMany(users);
    console.log('👤 Seeded users');

    // Seed NFTs
    const nfts = [
      { nftId: 1, name: 'Bored Ape #001', price: '99 ETH', image: '/image/photo_2026-05-01_01-41-25.jpg', description: 'The crown jewel of the collection.', category: 'Legendary' },
      { nftId: 2, name: 'Bored Ape #723', price: '2 ETH', image: '/image/photo_2026-05-01_01-41-40.jpg', description: 'A classic ape with great potential.', category: 'Rare' },
      { nftId: 3, name: 'Bored Ape #445', price: '1.5 ETH', image: '/image/photo_2026-05-01_01-41-45.jpg', description: 'Looking for a new home.', category: 'Common' },
      { nftId: 4, name: 'Bored Ape #999', price: '50 ETH', image: '/image/photo_2026-05-01_01-41-51.jpg', description: 'A digital masterpiece.', category: 'Epic' },
      { nftId: 5, name: 'Bored Ape #312', price: '5 ETH', image: '/image/photo_2026-05-01_01-41-57.jpg', description: 'Simple yet elegant.', category: 'Uncommon' },
      { nftId: 6, name: 'Bored Ape #187', price: '10 ETH', image: '/image/photo_2026-05-01_01-42-03.jpg', description: 'A bold statement.', category: 'Rare' },
      { nftId: 7, name: 'Bored Ape #552', price: '3.5 ETH', image: '/image/photo_2026-05-01_01-42-10.jpg', description: 'Vibrant and energetic.', category: 'Uncommon' },
      { nftId: 8, name: 'Bored Ape #661', price: '12 ETH', image: '/image/photo_2026-05-01_01-42-15.jpg', description: 'A rare find in the digital wilderness.', category: 'Rare' },
      { nftId: 9, name: 'Bored Ape #228', price: '0.8 ETH', image: '/image/photo_2026-05-01_01-42-21.jpg', description: 'Great for first-time collectors.', category: 'Common' },
      { nftId: 10, name: 'Bored Ape #883', price: '25 ETH', image: '/image/photo_2026-05-01_01-42-28.jpg', description: 'An absolute masterpiece of digital art.', category: 'Epic' },
      { nftId: 11, name: 'Bored Ape #112', price: '7.2 ETH', image: '/image/photo_2026-05-01_01-42-33.jpg', description: 'Elegant and sophisticated.', category: 'Rare' },
      { nftId: 12, name: 'Bored Ape #334', price: '15 ETH', image: '/image/2aa17bb0491e72c20a3742e1ef43ff8c.jpg', description: 'The neon explorer.', category: 'Legendary' },
      { nftId: 13, name: 'Bored Ape #449', price: '4.2 ETH', image: '/image/611f9a591fafdd003c48900859d8abeb.jpg', description: 'Deep in the jungle.', category: 'Uncommon' },
      { nftId: 14, name: 'Bored Ape #771', price: '30 ETH', image: '/image/8fbeeee7371be77e365c6ae72fccdd2f.jpg', description: 'Golden hour special.', category: 'Epic' },
      { nftId: 15, name: 'Bored Ape #505', price: '2.8 ETH', image: '/image/ae0ee41faa473bec4f214bc626fdd8c5.jpg', description: 'Quietly confident.', category: 'Rare' },
    ];

    await NFT.insertMany(nfts);
    console.log('🖼️ Seeded NFTs');

    // Seed Cart
    await CartItem.create({ userId: 42, nftId: 2, quantity: 1 });
    console.log('🛒 Seeded cart items');

    // Seed Orders
    const orders = [
      { orderId: 1000, buyerId: 1, nftId: 1, nftName: 'Bored Ape #001', price: '99 ETH', status: 'completed', flag: 'CTF{1D0R_M4rk3tpl4c3_Pwn3d}' },
      { orderId: 1056, buyerId: 42, nftId: 2, nftName: 'Bored Ape #723', price: '2 ETH', status: 'completed' },
      { orderId: 1057, buyerId: 43, nftId: 3, nftName: 'Bored Ape #445', price: '1.5 ETH', status: 'completed' },
    ];

    await Order.insertMany(orders);
    console.log('📜 Seeded orders');

    console.log('✅ Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
