const rentalmodel = require("../model/rental.model")
const usermodel = require("../model/user.model")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")

// ============================================================
// HELPERS
// ============================================================

function uploadBufferToCloudinary(buffer) {
    return new Promise(
        (resolve, reject) => {
            const stream =
                cloudinary.uploader.upload_stream(
                    {
                        folder:
                            "rentora/listings"
                    },

                    (
                        error,
                        result
                    ) => {
                        if (error) {
                            return reject(
                                error
                            )
                        }

                        resolve(result)
                    }
                )

            streamifier
                .createReadStream(
                    buffer
                )
                .pipe(stream)
        }
    )
}

async function uploadMultipleImages(
    files
) {
    if (
        !files ||
        files.length === 0
    ) {
        return []
    }

    const uploadedImages = []

    for (const file of files) {
        const result =
            await uploadBufferToCloudinary(
                file.buffer
            )

        uploadedImages.push({
            url: result.secure_url,
            publicId:
                result.public_id
        })
    }

    return uploadedImages
}

function parseArray(value) {
    if (Array.isArray(value)) {
        return value
    }

    if (
        typeof value === "string"
    ) {
        try {
            const parsed =
                JSON.parse(value)

            return Array.isArray(
                parsed
            )
                ? parsed
                : []
        } catch {
            return value
                ? [value]
                : []
        }
    }

    return []
}

function parseBoolean(value) {
    return (
        value === true ||
        value === "true"
    )
}

function validatePhone(phone) {
    return /^9[678]\d{8}$/.test(
        String(phone || "").trim()
    )
}

function parseLocation(locationInput) {
    const parsed =
        typeof locationInput ===
            "string"
            ? JSON.parse(
                locationInput
            )
            : locationInput

    if (
        !parsed ||
        !Array.isArray(
            parsed.coordinates
        ) ||
        parsed.coordinates.length !==
        2
    ) {
        throw new Error(
            "Location coordinates must contain [lng, lat]"
        )
    }

    const longitude = Number(
        parsed.coordinates[0]
    )

    const latitude = Number(
        parsed.coordinates[1]
    )

    if (
        !Number.isFinite(
            longitude
        ) ||
        !Number.isFinite(latitude)
    ) {
        throw new Error(
            "Longitude and latitude must be valid numbers"
        )
    }

    if (
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
    ) {
        throw new Error(
            "Invalid longitude or latitude"
        )
    }

    return {
        type: "Point",

        coordinates: [
            longitude,
            latitude
        ],

        address:
            parsed.address || ""
    }
}

// ============================================================
// UPLOAD IMAGE
// ============================================================

async function uploadimage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message:
                    "No image file provided"
            })
        }

        const result =
            await uploadBufferToCloudinary(
                req.file.buffer
            )

        return res.status(201).json({
            url: result.secure_url,
            publicId:
                result.public_id
        })
    } catch (e) {
        console.error(
            "Image upload error:",
            e
        )

        return res.status(500).json({
            message:
                "Image upload failed"
        })
    }
}

// ============================================================
// CREATE PROPERTY
// ============================================================

async function createproperty(
    req,
    res
) {
    try {
        if (
            !req.user ||
            !req.user.id
        ) {
            return res.status(401).json({
                message:
                    "Unauthorized"
            })
        }

        const {
            title,
            description,
            type,
            price,
            contactPhone,
            rooms,
            furnished,
            genderPreference,
            waterSupply,
            amenities
        } = req.body

        if (
            !title ||
            !description ||
            price === undefined ||
            price === null ||
            !req.body.location ||
            !type
        ) {
            return res.status(400).json({
                message:
                    "Title, description, price, location and type are required"
            })
        }

        const owner =
            await usermodel.findById(
                req.user.id
            )

        if (!owner) {
            return res.status(404).json({
                message:
                    "Owner account not found"
            })
        }

        const finalContactPhone =
            String(
                contactPhone ||
                owner.phone ||
                ""
            ).trim()

        if (
            !validatePhone(
                finalContactPhone
            )
        ) {
            return res.status(400).json({
                message:
                    "Enter a valid 10-digit Nepali contact number"
            })
        }

        let location

        try {
            location =
                parseLocation(
                    req.body.location
                )
        } catch (e) {
            return res
                .status(400)
                .json({
                    message:
                        e.message
                })
        }

        let finalImages = []

        if (
            req.files &&
            req.files.length > 0
        ) {
            finalImages =
                await uploadMultipleImages(
                    req.files
                )
        }

        if (
            finalImages.length ===
            0 &&
            req.body.images
        ) {
            finalImages =
                parseArray(
                    req.body.images
                )
        }

        const finalAmenities =
            parseArray(amenities)

        const parsedPrice =
            Number(price)

        if (
            !Number.isFinite(
                parsedPrice
            ) ||
            parsedPrice <= 0
        ) {
            return res.status(400).json({
                message:
                    "Price must be a valid number greater than 0"
            })
        }

        const property =
            await rentalmodel.create({
                title:
                    String(
                        title
                    ).trim(),

                description:
                    String(
                        description
                    ).trim(),

                type,

                price:
                    parsedPrice,

                contactPhone:
                    finalContactPhone,

                owner:
                    req.user.id,

                location,

                images:
                    finalImages,

                amenities:
                    finalAmenities,

                rooms:
                    rooms === "" ||
                        rooms ===
                        undefined
                        ? undefined
                        : Number(
                            rooms
                        ),

                furnished:
                    parseBoolean(
                        furnished
                    ),

                genderPreference:
                    genderPreference ||
                    "any",

                waterSupply:
                    waterSupply || "",

                isAvailable: true
            })

        await property.populate(
            "owner",
            "name phone profilePicture"
        )

        return res.status(201).json({
            message:
                "Property has been added",

            property
        })
    } catch (e) {
        console.error(
            "Create property error:",
            e
        )

        return res.status(500).json({
            message:
                e.message ||
                "Something went wrong on our side"
        })
    }
}

// ============================================================
// GET ALL PROPERTIES
// ============================================================

async function getallproperties(
    req,
    res
) {
    try {
        const {
            minPrice,
            maxPrice,
            search,
            sort,
            page,
            limit
        } = req.query

        const filter = {}

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {
            filter.price = {}

            if (
                minPrice !==
                undefined
            ) {
                const min =
                    Number(
                        minPrice
                    )

                if (
                    !Number.isFinite(
                        min
                    )
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "minPrice must be a valid number"
                        })
                }

                filter.price.$gte =
                    min
            }

            if (
                maxPrice !==
                undefined
            ) {
                const max =
                    Number(
                        maxPrice
                    )

                if (
                    !Number.isFinite(
                        max
                    )
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "maxPrice must be a valid number"
                        })
                }

                filter.price.$lte =
                    max
            }
        }

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            }
        }

        let sortOption = {}

        if (
            sort === "price_asc"
        ) {
            sortOption.price = 1
        } else if (
            sort === "price_desc"
        ) {
            sortOption.price = -1
        } else if (
            sort === "newest"
        ) {
            sortOption.createdAt =
                -1
        } else if (
            sort === "oldest"
        ) {
            sortOption.createdAt = 1
        }

        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )

        const currentLimit =
            Math.max(
                Number(limit) || 10,
                1
            )

        const skip =
            (currentPage - 1) *
            currentLimit

        const properties =
            await rentalmodel
                .find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(
                    currentLimit
                )
                .populate(
                    "owner",
                    "name phone profilePicture"
                )

        const totalCount =
            await rentalmodel.countDocuments(
                filter
            )

        return res.status(200).json({
            properties,

            pagination: {
                currentPage,

                totalPages:
                    Math.ceil(
                        totalCount /
                        currentLimit
                    ),

                totalCount,
                limit:
                    currentLimit
            }
        })
    } catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                "Something went wrong on our side"
        })
    }
}

// ============================================================
// GET ONE PROPERTY
// ============================================================

async function getoneproperty(
    req,
    res
) {
    try {
        const property =
            await rentalmodel
                .findById(
                    req.params.id
                )
                .populate(
                    "owner",
                    "name phone profilePicture"
                )

        if (!property) {
            return res.status(404).json({
                message:
                    "Couldn't find that property"
            })
        }

        return res.status(200).json(
            property
        )
    } catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                "Internal server error"
        })
    }
}

// ============================================================
// UPDATE PROPERTY
// ============================================================

async function updateproperty(
    req,
    res
) {
    try {
        const property =
            req.property

        if (!property) {
            return res.status(404).json({
                message:
                    "Property not found"
            })
        }

        const {
            title,
            description,
            type,
            price,
            contactPhone,
            location,
            rooms,
            furnished,
            genderPreference,
            waterSupply,
            amenities,
            isAvailable,
            images
        } = req.body

        if (
            title !== undefined
        ) {
            const value =
                String(title).trim()

            if (!value) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Title cannot be empty"
                    })
            }

            property.title =
                value
        }

        if (
            description !==
            undefined
        ) {
            const value =
                String(
                    description
                ).trim()

            if (!value) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Description cannot be empty"
                    })
            }

            property.description =
                value
        }

        if (type !== undefined) {
            property.type = type
        }

        if (
            price !== undefined
        ) {
            const value =
                Number(price)

            if (
                !Number.isFinite(
                    value
                ) ||
                value <= 0
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Price must be greater than 0"
                    })
            }

            property.price =
                value
        }

        if (
            contactPhone !==
            undefined
        ) {
            const value =
                String(
                    contactPhone
                ).trim()

            if (
                !validatePhone(
                    value
                )
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Enter a valid 10-digit Nepali contact number"
                    })
            }

            property.contactPhone =
                value
        }

        if (
            rooms !== undefined
        ) {
            if (
                rooms === "" ||
                rooms === null
            ) {
                property.rooms =
                    undefined
            } else {
                const value =
                    Number(rooms)

                if (
                    !Number.isFinite(
                        value
                    ) ||
                    value < 0
                ) {
                    return res
                        .status(400)
                        .json({
                            message:
                                "Rooms must be a valid number"
                        })
                }

                property.rooms =
                    value
            }
        }

        if (
            furnished !==
            undefined
        ) {
            property.furnished =
                parseBoolean(
                    furnished
                )
        }

        if (
            genderPreference !==
            undefined
        ) {
            property.genderPreference =
                genderPreference
        }

        if (
            waterSupply !==
            undefined
        ) {
            property.waterSupply =
                waterSupply
        }

        if (
            isAvailable !==
            undefined
        ) {
            if (
                ![
                    true,
                    false,
                    "true",
                    "false"
                ].includes(
                    isAvailable
                )
            ) {
                return res
                    .status(400)
                    .json({
                        message:
                            "isAvailable must be true or false"
                    })
            }

            property.isAvailable =
                parseBoolean(
                    isAvailable
                )
        }

        if (
            amenities !== undefined
        ) {
            property.amenities =
                parseArray(
                    amenities
                )
        }

        if (
            location !== undefined
        ) {
            try {
                property.location =
                    parseLocation(
                        location
                    )
            } catch (e) {
                return res
                    .status(400)
                    .json({
                        message:
                            e.message
                    })
            }
        }

        /*
         * PhotoUploader uploads images before the main form
         * is saved, so the frontend sends image objects:
         *
         * [
         *   { url, publicId }
         * ]
         *
         * During editing:
         * - retained old photos remain in the submitted array
         * - newly uploaded photos are also in that array
         * - removed old photos are absent
         *
         * We delete only the old Cloudinary images that have
         * disappeared from the submitted list.
         */
        if (images !== undefined) {
            const nextImages =
                parseArray(images)

            const nextIds =
                new Set(
                    nextImages
                        .map(
                            (img) =>
                                img?.publicId
                        )
                        .filter(
                            Boolean
                        )
                )

            const removedImages =
                (
                    property.images ||
                    []
                ).filter(
                    (img) =>
                        img.publicId &&
                        !nextIds.has(
                            img.publicId
                        )
                )

            for (
                const image of
                removedImages
            ) {
                try {
                    await cloudinary.uploader.destroy(
                        image.publicId
                    )
                } catch (e) {
                    console.error(
                        `Failed to delete Cloudinary image ${image.publicId}:`,
                        e
                    )
                }
            }

            property.images =
                nextImages
        }

        /*
         * Multipart uploads remain supported as well.
         */
        if (
            req.files &&
            req.files.length > 0
        ) {
            const uploaded =
                await uploadMultipleImages(
                    req.files
                )

            property.images = [
                ...(property.images ||
                    []),
                ...uploaded
            ]
        }

        const updatedProperty =
            await property.save()

        await updatedProperty.populate(
            "owner",
            "name phone profilePicture"
        )

        return res.status(200).json({
            message:
                "Property updated successfully",

            updatedProperty
        })
    } catch (e) {
        console.error(
            "Update property error:",
            e
        )

        return res.status(500).json({
            message:
                e.message ||
                "Internal server error"
        })
    }
}

// ============================================================
// DELETE PROPERTY
// ============================================================

async function deleteproperty(
    req,
    res
) {
    try {
        const property =
            req.property

        if (!property) {
            return res.status(404).json({
                message:
                    "Property couldn't be found to delete"
            })
        }

        for (
            const image of
            property.images || []
        ) {
            if (!image.publicId) {
                continue
            }

            try {
                await cloudinary.uploader.destroy(
                    image.publicId
                )
            } catch (e) {
                console.error(
                    `Failed to delete Cloudinary image ${image.publicId}:`,
                    e
                )
            }
        }

        await property.deleteOne()

        return res.status(200).json({
            message:
                "Deleted property",

            propToDelete:
                property
        })
    } catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                "Internal server error"
        })
    }
}

// ============================================================
// GET MY PROPERTIES
// ============================================================

async function getmyproperties(
    req,
    res
) {
    try {
        if (
            !req.user ||
            !req.user.id
        ) {
            return res.status(401).json({
                message:
                    "Unauthorized"
            })
        }

        const myproperties =
            await rentalmodel
                .find({
                    owner:
                        req.user.id
                })
                .sort({
                    createdAt: -1
                })
                .populate(
                    "owner",
                    "name phone profilePicture"
                )

        return res.status(200).json({
            message:
                "Here are the listings of your properties",

            myproperties
        })
    } catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                "Internal server error"
        })
    }
}

// ============================================================
// NEARBY
// ============================================================

async function getnearbyproperties(
    req,
    res
) {
    const {
        lng,
        lat,
        radius,
        minPrice,
        maxPrice,
        search,
        sort,
        page,
        limit
    } = req.query

    if (
        lng === undefined ||
        lat === undefined
    ) {
        return res.status(400).json({
            message:
                "longitude and latitude are required"
        })
    }

    const longitude = Number(lng)
    const latitude = Number(lat)

    if (
        !Number.isFinite(
            longitude
        ) ||
        !Number.isFinite(latitude)
    ) {
        return res.status(400).json({
            message:
                "longitude and latitude must be valid numbers"
        })
    }

    let maxDistance = 5000

    if (radius !== undefined) {
        const radiusInKm =
            Number(radius)

        if (
            !Number.isFinite(
                radiusInKm
            ) ||
            radiusInKm <= 0
        ) {
            return res.status(400).json({
                message:
                    "radius must be a valid positive number"
            })
        }

        maxDistance =
            radiusInKm * 1000
    }

    const currentPage =
        Math.max(
            Number(page) || 1,
            1
        )

    const currentLimit =
        Math.max(
            Number(limit) || 10,
            1
        )

    const query = {}

    if (
        minPrice !== undefined ||
        maxPrice !== undefined
    ) {
        query.price = {}

        if (
            minPrice !== undefined
        ) {
            query.price.$gte =
                Number(minPrice)
        }

        if (
            maxPrice !== undefined
        ) {
            query.price.$lte =
                Number(maxPrice)
        }
    }

    if (search) {
        query.title = {
            $regex: search,
            $options: "i"
        }
    }

    try {
        const geoNearStage = {
            $geoNear: {
                near: {
                    type: "Point",

                    coordinates: [
                        longitude,
                        latitude
                    ]
                },

                distanceField:
                    "distance",

                maxDistance,

                spherical: true,

                query
            }
        }

        const countResult =
            await rentalmodel.aggregate(
                [
                    geoNearStage,

                    {
                        $count:
                            "total"
                    }
                ]
            )

        const totalCount =
            countResult.length
                ? countResult[0]
                    .total
                : 0

        const pipeline = [
            geoNearStage
        ]

        if (
            sort === "price_asc"
        ) {
            pipeline.push({
                $sort: {
                    price: 1
                }
            })
        } else if (
            sort === "price_desc"
        ) {
            pipeline.push({
                $sort: {
                    price: -1
                }
            })
        } else if (
            sort === "newest"
        ) {
            pipeline.push({
                $sort: {
                    createdAt: -1
                }
            })
        }

        pipeline.push(
            {
                $skip:
                    (currentPage -
                        1) *
                    currentLimit
            },

            {
                $limit:
                    currentLimit
            }
        )

        const properties =
            await rentalmodel.aggregate(
                pipeline
            )

        await rentalmodel.populate(
            properties,
            {
                path: "owner",
                select:
                    "name phone profilePicture"
            }
        )

        return res.status(200).json({
            properties,

            pagination: {
                currentPage,

                totalPages:
                    Math.ceil(
                        totalCount /
                        currentLimit
                    ),

                totalCount,

                limit:
                    currentLimit
            }
        })
    } catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                "Something went wrong on our side"
        })
    }
}

// ============================================================
// POLYGON
// ============================================================

async function getpropertiesinpolygon(
    req,
    res
) {
    try {
        const {
            polygon,
            minPrice,
            maxPrice,
            search,
            sort,
            page,
            limit
        } = req.body

        if (
            !Array.isArray(
                polygon
            ) ||
            polygon.length < 4
        ) {
            return res.status(400).json({
                message:
                    "A closed polygon with at least 4 points is required"
            })
        }

        const filter = {
            location: {
                $geoWithin: {
                    $geometry: {
                        type:
                            "Polygon",

                        coordinates: [
                            polygon
                        ]
                    }
                }
            }
        }

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {
            filter.price = {}

            if (
                minPrice !==
                undefined
            ) {
                filter.price.$gte =
                    Number(
                        minPrice
                    )
            }

            if (
                maxPrice !==
                undefined
            ) {
                filter.price.$lte =
                    Number(
                        maxPrice
                    )
            }
        }

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            }
        }

        const sortOption = {}

        if (
            sort === "price_asc"
        ) {
            sortOption.price = 1
        } else if (
            sort === "price_desc"
        ) {
            sortOption.price = -1
        } else if (
            sort === "newest"
        ) {
            sortOption.createdAt =
                -1
        }

        const currentPage =
            Math.max(
                Number(page) || 1,
                1
            )

        const currentLimit =
            Math.max(
                Number(limit) || 10,
                1
            )

        const properties =
            await rentalmodel
                .find(filter)
                .sort(sortOption)
                .skip(
                    (currentPage -
                        1) *
                    currentLimit
                )
                .limit(
                    currentLimit
                )
                .populate(
                    "owner",
                    "name phone profilePicture"
                )

        const totalCount =
            await rentalmodel.countDocuments(
                filter
            )

        return res.status(200).json({
            properties,

            pagination: {
                currentPage,

                totalPages:
                    Math.ceil(
                        totalCount /
                        currentLimit
                    ),

                totalCount,

                limit:
                    currentLimit
            }
        })
    } catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                "Something went wrong on our side"
        })
    }
}

module.exports = {
    uploadimage,
    createproperty,
    getallproperties,
    getoneproperty,
    updateproperty,
    deleteproperty,
    getmyproperties,
    getnearbyproperties,
    getpropertiesinpolygon
}