const mongoose = require("mongoose")

const userschema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        enum: ["owner", "renter"],
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^9[678]\d{8}$/, "Enter a valid 10-digit Nepali mobile number"]
    }
},

    { timestamps: true }
)

const usermodel = mongoose.model("user", userschema)

module.exports = usermodel