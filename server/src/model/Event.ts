import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: Date;
  location: string;
  tickets: {
    vip: number;
    general: number;
    premium: number;
  };
  seats: number;
  image?: string;
}

const EventSchema: Schema<IEvent>=new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  tickets: {
    vip: { type: Number, required: true },
    general: { type: Number, required: true },
    premium: { type: Number, required: true }
  },
  seats: { type: Number, required: true },
  image: { type: String }
});

export const Event = mongoose.model<IEvent>('Event', EventSchema);
