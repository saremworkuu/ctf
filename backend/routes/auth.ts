import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.ts';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_ctf_key';

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, archiveSignature } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ username }, { email }] 
    });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Dynamic userId for new registers
    const lastUser = await User.findOne().sort({ userId: -1 });
    const userId = lastUser ? lastUser.userId + 1 : 100;

    const newUser = new User({
      userId,
      username,
      email,
      password: hashedPassword,
      archiveSignature,
      role: 'user'
    });

    await newUser.save();

    const token = jwt.sign(
      { userId: newUser.userId, username: newUser.username, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({
      token,
      userId: newUser.userId,
      username: newUser.username,
      role: newUser.role
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user.userId, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Provide a hint for the CTF player: helpfully showing their last order ID?
    // In reality, this would just be the token, but for CTF we can hint.
    res.json({
      token,
      userId: user.userId,
      username: user.username,
      role: user.role,
      hint: "Access your orders at /api/orders/{id}. Try looking for high-value transactions."
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during login' });
  }
});

export default router;
