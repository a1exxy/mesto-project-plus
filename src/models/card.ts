import mongoose, { Schema } from 'mongoose';

interface ICard {
  name: string
  link: string
  owner: Schema.Types.ObjectId,
  likes: Array<Schema.Types.ObjectId>,
  createdAt: Date
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{
      type: Schema.Types.ObjectId,
      required: true,
    }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model<ICard>('card', cardSchema);
