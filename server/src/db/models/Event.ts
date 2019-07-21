import { model, Types, Schema } from 'mongoose';

export default model(
  'Event',
  new Schema({
    date: {
      type: Date,
      null: true,
    },
    faceValue: {
      type: Number,
      default: null,
    },
    festivalName: {
      type: String,
      default: '',
      null: true,
    },
    genre: {
      type: String,
      default: '',
    },
    name: {
      type: String,
      default: '',
    },
    subGenre: {
      type: String,
      default: '',
      null: true,
    },
    venue: {
      type: Types.ObjectId,
      ref: 'Venue',
    },
    wasOpener: {
      type: Boolean,
      default: false,
    },
  }),
);
