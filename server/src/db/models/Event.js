const { model, Schema } = require('mongoose');

module.exports = model(
  'Event',
  new Schema({
    _id: Schema.Types.ObjectId,
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
      default: "",
      null: true,
    },
    genre: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      default: "",
    },
    subGenre: {
      type: String,
      default: "",
      null: true,
    },
    venue: {
      type: Schema.ObjectId,
      ref: 'Venue',
    },
    wasOpener: {
      type: Boolean,
      default: false,
    },
}));
