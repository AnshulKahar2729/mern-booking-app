const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const placeSchema = new Schema({
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  title: String,
  address: String,
  description: String,
  photos: [String],
  perks: [String],
  extraInfo: String,
  checkIn: Number,
  checkOut: Number,
  maxGuests: Number,
});

const PlaceModel = model("Place", placeSchema);
module.exports = PlaceModel;
