import mongoose, { Schema, Document } from 'mongoose';

export interface ICartItem {
  event: mongoose.Schema.Types.ObjectId;
  ticketCategory: 'vip' | 'general' | 'premium';
  price: number;
  seatNumber: string;
}

export interface ICart extends Document {
  user: mongoose.Schema.Types.ObjectId;
  items: ICartItem[];
  updatedAt: Date;
}

const CartItemSchema: Schema = new Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketCategory: { type: String, enum: ['vip', 'general', 'premium'], required: true },
  price: { type: Number, required: true },
  seatNumber: { type: String, required: true }
});

const CartSchema: Schema<ICart> = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  items: [CartItemSchema],
  updatedAt: { type: Date, default: Date.now }
});

export const Cart = mongoose.model<ICart>('Cart', CartSchema);
