import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';
import CartItem from '../models/CartItem.ts';
import NFT from '../models/NFT.ts';

const router = express.Router();

// Get user cart (Protected)
router.get('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const items = await CartItem.find({ userId: req.user?.userId });
    
    // Enrich with NFT data
    const enrichedItems = await Promise.all(items.map(async (item) => {
      const nft = await NFT.findOne({ nftId: item.nftId });
      return {
        ...item.toObject(),
        nft
      };
    }));

    res.json(enrichedItems);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cart' });
  }
});

// Add to cart (Protected)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { nftId } = req.body;
    const userId = req.user?.userId;

    let item = await CartItem.findOne({ userId, nftId });

    if (item) {
      item.quantity += 1;
    } else {
      item = new CartItem({ userId, nftId, quantity: 1 });
    }

    await item.save();
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Error adding to cart' });
  }
});

// Remove from cart (Protected)
router.delete('/:nftId', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { nftId } = req.params;
    const userId = req.user?.userId;

    await CartItem.deleteOne({ userId, nftId: parseInt(nftId) });
    res.json({ message: 'Item removed from cart' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing from cart' });
  }
});

export default router;
