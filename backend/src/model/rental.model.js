const mongoose = require("mongoose");

const rentalschema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },


    location: {
        type: {
            type: String,
            enum: ["Point"],
            default: "Point"
        },
        coordinates: {
            type: [Number], // [longitude, latitude] — order matters, lng first 
            required: true
        },
        address: String // human-readable, for display
    },


    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    images: [{
        type: String
    }]
},
    {
        timestamps: true
    })


const rentalmodel = mongoose.model("rental", rentalschema)

module.exports = rentalmodel