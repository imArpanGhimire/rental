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
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
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