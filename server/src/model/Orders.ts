import mongoose, { Schema, Document } from 'mongoose';

export interface IOrder extends Document {
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketCategory: 'vip' | 'general' | 'premium';
  price: number;
  seatNumber: string;
  createdAt: Date;
}

const OrderSchema: Schema<IOrder> = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  ticketCategory: { type: String, enum: ['vip', 'general', 'premium'], required: true },
  price: { type: Number, required: true },
  seatNumber: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export const Order = mongoose.model<IOrder>('Order', OrderSchema);
