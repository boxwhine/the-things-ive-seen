const { model, Schema } = require('mongoose');

module.exports = model(
  'Venue',
  new Schema({
    _id: Schema.Types.ObjectId,
    city: {
      type: String,
      default: "",
      null: false,
    },
    name: {
      type: String,
      default: "",
      null: false,
    },
    state: {
      type: String,
      default: "",
      null: false,
    },
  })
);