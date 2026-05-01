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
      { nftId: 1, name: 'Bored Ape #001', price: '99 ETH', image: 'https://gateway.pinata.cloud/ipfs/QmeSjSinHpRuzXGO9MRsybtXPqbDxrzBut4WvTvWB18W6r', description: 'The crown jewel of the collection.', category: 'Legendary' },
      { nftId: 2, name: 'Bored Ape #723', price: '2 ETH', image: 'https://gateway.pinata.cloud/ipfs/QmZDeitxX4DnoE89V1rS4m1K9Y637idJvGvyL9hK9wJv6a', description: 'A classic ape with great potential.', category: 'Rare' },
      { nftId: 3, name: 'Bored Ape #445', price: '1.5 ETH', image: 'https://gateway.pinata.cloud/ipfs/QmYf6unKrvzGZsh6XoYzW8eW1yY8Y5L9iXZP7M7Y6XoYzW', description: 'Looking for a new home.', category: 'Common' },
      { nftId: 4, name: 'Bored Ape #999', price: '50 ETH', image: 'https://gateway.pinata.cloud/ipfs/QmSuXZP7M7Y6XoYzW8eW1yY8Y5L9iXZP7M7Y6XoYzW', description: 'A digital masterpiece.', category: 'Epic' },
      { nftId: 5, name: 'Bored Ape #312', price: '5 ETH', image: 'https://gateway.pinata.cloud/ipfs/QmRsybtXPqbDxrzBut4WvTvWB18W6rQmeSjSinHpRuzXGO', description: 'Simple yet elegant.', category: 'Uncommon' },
      { nftId: 6, name: 'Bored Ape #187', price: '10 ETH', image: 'https://gateway.pinata.cloud/ipfs/QmW8eW1yY8Y5L9iXZP7M7Y6XoYzWQmYf6unKrvzGZsh6Xo', description: 'A bold statement.', category: 'Rare' },
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
