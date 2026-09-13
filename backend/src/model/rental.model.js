const mongoose = require("mongoose")

const rentalschema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            required: true,
            trim: true
        },

        type: {
            type: String,
            enum: [
                "hostel",
                "rental",
                "flat"
            ],
            required: true
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                required: true
            },

            address: {
                type: String,
                trim: true,
                default: ""
            }
        },

        price: {
            type: Number,
            required: true,
            min: 0
        },

        /*
         * Contact number for this specific listing.
         *
         * This normally starts with the owner's registered
         * phone number, but the owner can change it for
         * individual properties.
         */
        contactPhone: {
            type: String,
            required: true,
            trim: true,

            match: [
                /^9[678]\d{8}$/,
                "Enter a valid 10-digit Nepali mobile number"
            ]
        },

        amenities: [
            {
                type: String
            }
        ],

        rooms: {
            type: Number,
            min: 0
        },

        furnished: {
            type: Boolean,
            default: false
        },

        genderPreference: {
            type: String,
            enum: [
                "any",
                "male",
                "female"
            ],
            default: "any"
        },

        waterSupply: {
            type: String,
            enum: [
                "municipal",
                "tanker",
                "jar",
                "borewell",
                ""
            ],
            default: ""
        },

        isAvailable: {
            type: Boolean,
            default: true
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        images: [
            {
                url: {
                    type: String,
                    required: true
                },

                publicId: {
                    type: String,
                    required: true
                }
            }
        ]
    },

    {
        timestamps: true
    }
)

rentalschema.index({
    location: "2dsphere"
})

const rentalmodel =
    mongoose.model(
        "rental",
        rentalschema
    )

module.exports = rentalmodel