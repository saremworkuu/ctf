import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  userId: number;
  username: string;
  email: string;
  password?: string;
  role: 'admin' | 'user';
  archiveSignature: string;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>({
  userId: { type: Number, required: true, unique: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  archiveSignature: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<IUser>('User', UserSchema);
