import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';
import Order from '../models/Order.ts';
import CartItem from '../models/CartItem.ts';
import NFT from '../models/NFT.ts';
import rateLimit from 'express-rate-limit';

const router = express.Router();

// Rate limit for order routes
const orderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { message: 'Too many requests, please try again later.' }
});

// Create order (Protected)
router.post('/', [authMiddleware, orderLimiter], async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const cartItems = await CartItem.find({ userId });

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const orders = [];
    for (const item of cartItems) {
      const nft = await NFT.findOne({ nftId: item.nftId });
      if (!nft) continue;

      const lastOrder = await Order.findOne().sort({ orderId: -1 });
      const orderId = lastOrder ? lastOrder.orderId + 1 : 2000;

      const order = new Order({
        orderId,
        buyerId: userId,
        nftId: item.nftId,
        nftName: nft.name,
        price: nft.price,
        status: 'completed'
      });

      await order.save();
      orders.push(order);
    }

    // Clear cart after order
    await CartItem.deleteMany({ userId });

    res.status(201).json({ message: 'Order(s) placed successfully', orders });
  } catch (error) {
    res.status(500).json({ message: 'Error processing order' });
  }
});

// Get order by orderId (Protected) ⚠️ IDOR VULNERABLE
// This route fails to check if 'buyerId' matches 'req.user.userId'
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const orderId = parseInt(req.params.id);
    
    // ⚠️ VULNERABLE: No ownership check performed!
    const order = await Order.findOne({ orderId });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Returns full order data including potential flags
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order' });
  }
});

export default router;
