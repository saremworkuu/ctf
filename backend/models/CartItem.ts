import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem extends Document {
  userId: number;
  nftId: number;
  quantity: number;
}

const CartItemSchema = new Schema<ICartItem>({
  userId: { type: Number, required: true },
  nftId: { type: Number, required: true },
  quantity: { type: Number, default: 1 }
});

export default mongoose.model<ICartItem>('CartItem', CartItemSchema);
