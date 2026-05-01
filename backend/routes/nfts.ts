import express, { Request, Response } from 'express';
import NFT from '../models/NFT.ts';

const router = express.Router();

// Public: Get all NFTs
router.get('/', async (req: Request, res: Response) => {
  try {
    const nfts = await NFT.find();
    res.json(nfts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NFTs' });
  }
});

// Public: Get single NFT
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const nft = await NFT.findOne({ nftId: parseInt(req.params.id) });
    if (!nft) {
      return res.status(404).json({ message: 'NFT not found' });
    }
    res.json(nft);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching NFT' });
  }
});

export default router;
