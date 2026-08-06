const mongoose = require("mongoose");

const visitRequestSchema = new mongoose.Schema(
  {
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "rental",
      required: true,
    },
    renter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 300,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const visitRequestModel = mongoose.model("visitRequest", visitRequestSchema);
module.exports = visitRequestModel;
