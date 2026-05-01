import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  orderId: number;
  buyerId: number;
  nftId: number;
  nftName: string;
  price: string;
  status: string;
  flag?: string;
  createdAt: Date;
}

const OrderSchema = new Schema<IOrder>({
  orderId: { type: Number, required: true, unique: true },
  buyerId: { type: Number, required: true },
  nftId: { type: Number, required: true },
  nftName: { type: String, required: true },
  price: { type: String, required: true },
  status: { type: String, required: true },
  flag: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IOrder>('Order', OrderSchema);
