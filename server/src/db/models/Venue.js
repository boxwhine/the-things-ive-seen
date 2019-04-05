const { model, Schema } = require('mongoose');

module.exports = model(
  'Venue',
  new Schema({
    address: {
      type: String,
      default: '',
      null: false,
    },
    city: {
      type: String,
      default: '',
      null: false,
    },
    lat: {
      type: Number,
      default: -1,
      null: false,
    },
    lng: {
      type: Number,
      default: -1,
      null: false,
    },
    name: {
      type: String,
      default: '',
      null: false,
    },
    placeId: {
      type: String,
      default: '',
      null: false,
    },
    state: {
      type: String,
      default: '',
      null: false,
    },
  }),
);
