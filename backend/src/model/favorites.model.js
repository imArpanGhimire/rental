const mongoose = require("mongoose")
const favoriteSchema = new mongoose.Schema({
    renter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    property: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "rental",
        required: true
    },
},
    { timestamps: true }
)

favoriteSchema.index({ renter: 1, property: 1 }, { unique: true })

const favoritemodel = mongoose.model("favorite", favoriteSchema)
module.exports = favoritemodel

