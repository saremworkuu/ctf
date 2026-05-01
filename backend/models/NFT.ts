import mongoose, { Schema, Document } from 'mongoose';

export interface INFT extends Document {
  nftId: number;
  name: string;
  price: string;
  image: string;
  description: string;
  category: string;
}

const NFTSchema = new Schema<INFT>({
  nftId: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  price: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true }
});

export default mongoose.model<INFT>('NFT', NFTSchema);
