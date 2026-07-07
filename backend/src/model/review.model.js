const mongoose = require("mongoose")

const reviewschema = new mongoose.Schema({
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rental",
        required: true
    },
    reviewer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true,
        trim: true
    },
    ownerReply: {
        comment: {
            type: String,
            trim: true
        },
        repliedAt: {
            type: Date
        }
    }
}, { timestamps: true }
)

reviewschema.index({ property: 1, reviewer: 1 }, { unique: true })

const reviewmodel = mongoose.model("review", reviewschema)

module.exports = reviewmodel