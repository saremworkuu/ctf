import express, { Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.ts';
import User from '../models/User.ts';

const router = express.Router();

// Get user profile (Protected) ⚠️ IDOR VULNERABLE
// This route fails to check if 'userId' matches 'req.user.userId'
router.get('/:id', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const userId = parseInt(req.params.id);

    // ⚠️ VULNERABLE: No ownership check!
    const user = await User.findOne({ userId }).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user profile' });
  }
});

// Self profile helper
router.get('/me', authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findOne({ userId: req.user?.userId }).select('-password');
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

export default router;
