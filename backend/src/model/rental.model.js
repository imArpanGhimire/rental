const mongoose = require("mongoose");

const rentalschema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },

    type: {
      type: String,
      enum: ["hostel", "rental", "flat"],
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: { type: [Number], required: true }, // [lng, lat]
      address: String,
    },

    price: { type: Number, required: true },

    rooms: { type: Number },           // number of rooms (flats/rental rooms)
    furnished: { type: Boolean, default: false },
    genderPreference: {
      type: String,
      enum: ["any", "male", "female"],
      default: "any",
    },
    waterSupply: {
      type: String,
      enum: ["municipal", "tanker", "jar", "borewell"],
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    images: [{ type: String }],
  },
  { timestamps: true }
);

rentalschema.index({ location: "2dsphere" });

const rentalmodel = mongoose.model("rental", rentalschema);
module.exports = rentalmodel;