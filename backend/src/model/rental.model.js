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

    amenities: [{ type: String }], // "WiFi", "Parking", "Attached Bathroom", etc.

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },

    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, required: true }, // needed to delete from Cloudinary later
      },
    ],
  },
  { timestamps: true }
);

rentalschema.index({ location: "2dsphere" });

const rentalmodel = mongoose.model("rental", rentalschema);
module.exports = rentalmodel;
