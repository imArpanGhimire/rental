const mongoose = require("mongoose")

const userschema = new mongoose.Schema(
    {
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
            required: true
        },

        role: {
            type: String,
            enum: ["owner", "renter"],
            required: true
        },

        phone: {
            type: String,
            trim: true,

            required: function () {
                return this.role === "owner"
            },

            validate: {
                validator: function (value) {
                    if (!value) {
                        return this.role !== "owner"
                    }

                    return /^9[678]\d{8}$/.test(value)
                },

                message:
                    "Enter a valid 10-digit Nepali mobile number"
            }
        },

        profilePicture: {
            type: String,
            default: ""
        },

        profilePicturePublicId: {
            type: String,
            default: ""
        },

        securityQuestions: {
            type: [
                {
                    question: {
                        type: String,
                        required: true
                    },

                    answerHash: {
                        type: String,
                        required: true
                    },

                    _id: false
                }
            ],

            validate: {
                validator: function (arr) {
                    return arr.length === 2
                },

                message:
                    "Exactly two security questions are required"
            },

            required: true
        }
    },

    {
        timestamps: true
    }
)

const usermodel = mongoose.model(
    "user",
    userschema
)

module.exports = usermodel