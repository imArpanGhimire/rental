const rentalmodel = require("../model/rental.model")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")


// ============================================================
// CLOUDINARY HELPERS
// ============================================================

function uploadBufferToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "rentora/listings"
            },
            (error, result) => {
                if (error) {
                    return reject(error)
                }

                resolve(result)
            }
        )

        streamifier
            .createReadStream(buffer)
            .pipe(stream)
    })
}


async function uploadMultipleImages(files) {
    if (!files || files.length === 0) {
        return []
    }

    const uploadedImages = []

    for (const file of files) {
        const result = await uploadBufferToCloudinary(
            file.buffer
        )

        uploadedImages.push({
            url: result.secure_url,
            publicId: result.public_id
        })
    }

    return uploadedImages
}


// ============================================================
// UPLOAD SINGLE IMAGE
// ============================================================

async function uploadimage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided"
            })
        }

        const result = await uploadBufferToCloudinary(
            req.file.buffer
        )

        return res.status(201).json({
            url: result.secure_url,
            publicId: result.public_id
        })
    }
    catch (e) {
        console.error("Image upload error:", e)

        return res.status(500).json({
            message: "Image upload failed"
        })
    }
}


// ============================================================
// CREATE PROPERTY
// ============================================================

async function createproperty(req, res) {
    try {
        const {
            title,
            description,
            type,
            price,
            rooms,
            furnished,
            genderPreference,
            waterSupply,
            amenities
        } = req.body

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const owner = req.user.id

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
                    "title, description, price, location, and type are required"
            })
        }

        // --------------------------------------------------------
        // Parse location
        // --------------------------------------------------------

        let parsedLocation

        try {
            parsedLocation =
                typeof req.body.location === "string"
                    ? JSON.parse(req.body.location)
                    : req.body.location
        }
        catch (e) {
            return res.status(400).json({
                message:
                    'location must be valid JSON, e.g. {"type":"Point","coordinates":[lng,lat],"address":"..."}'
            })
        }

        if (
            !parsedLocation ||
            !Array.isArray(parsedLocation.coordinates) ||
            parsedLocation.coordinates.length !== 2
        ) {
            return res.status(400).json({
                message:
                    "location coordinates must contain [lng, lat]"
            })
        }

        const longitude = Number(
            parsedLocation.coordinates[0]
        )

        const latitude = Number(
            parsedLocation.coordinates[1]
        )

        if (
            !Number.isFinite(longitude) ||
            !Number.isFinite(latitude)
        ) {
            return res.status(400).json({
                message:
                    "longitude and latitude must be valid numbers"
            })
        }

        if (
            longitude < -180 ||
            longitude > 180 ||
            latitude < -90 ||
            latitude > 90
        ) {
            return res.status(400).json({
                message:
                    "Invalid longitude or latitude"
            })
        }

        const location = {
            type: "Point",
            coordinates: [
                longitude,
                latitude
            ],
            address: parsedLocation.address
        }

        // --------------------------------------------------------
        // Upload images
        // --------------------------------------------------------

        let finalImages = []

        if (
            req.files &&
            req.files.length > 0
        ) {
            finalImages =
                await uploadMultipleImages(req.files)
        }

        // --------------------------------------------------------
        // Handle images already supplied as URLs
        // --------------------------------------------------------

        if (
            finalImages.length === 0 &&
            req.body.images
        ) {
            if (typeof req.body.images === "string") {
                try {
                    finalImages =
                        JSON.parse(req.body.images)
                }
                catch {
                    finalImages = []
                }
            }
            else if (Array.isArray(req.body.images)) {
                finalImages = req.body.images
            }
        }

        // --------------------------------------------------------
        // Handle amenities
        // --------------------------------------------------------

        let finalAmenities = amenities

        if (typeof amenities === "string") {
            try {
                finalAmenities =
                    JSON.parse(amenities)
            }
            catch {
                finalAmenities = [amenities]
            }
        }

        if (!Array.isArray(finalAmenities)) {
            finalAmenities = []
        }

        // --------------------------------------------------------
        // Create property
        // --------------------------------------------------------

        const property =
            await rentalmodel.create({
                title,
                description,
                type,
                price,
                owner,
                location,
                images: finalImages,
                amenities: finalAmenities,
                rooms,
                furnished,
                genderPreference,
                waterSupply
            })

        return res.status(201).json({
            message: "Property has been added",
            property
        })
    }
    catch (e) {
        console.error("Create property error:", e)

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

async function getallproperties(req, res) {
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

        // --------------------------------------------------------
        // Price filter
        // --------------------------------------------------------

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {
            filter.price = {}

            if (minPrice !== undefined) {
                const min = Number(minPrice)

                if (!Number.isFinite(min)) {
                    return res.status(400).json({
                        message:
                            "minPrice must be a valid number"
                    })
                }

                filter.price.$gte = min
            }

            if (maxPrice !== undefined) {
                const max = Number(maxPrice)

                if (!Number.isFinite(max)) {
                    return res.status(400).json({
                        message:
                            "maxPrice must be a valid number"
                    })
                }

                filter.price.$lte = max
            }
        }

        // --------------------------------------------------------
        // Search
        // --------------------------------------------------------

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            }
        }

        // --------------------------------------------------------
        // Sorting
        // --------------------------------------------------------

        let sortOption = {}

        if (sort === "price_asc") {
            sortOption.price = 1
        }
        else if (sort === "price_desc") {
            sortOption.price = -1
        }
        else if (sort === "newest") {
            sortOption.createdAt = -1
        }
        else if (sort === "oldest") {
            sortOption.createdAt = 1
        }

        // --------------------------------------------------------
        // Pagination
        // --------------------------------------------------------

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
            (currentPage - 1) * currentLimit

        // --------------------------------------------------------
        // Query
        // --------------------------------------------------------

        const allproperties =
            await rentalmodel
                .find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(currentLimit)
                .populate(
                    "owner",
                    "name phone"
                )

        const totalCount =
            await rentalmodel.countDocuments(
                filter
            )

        const totalPages =
            Math.ceil(
                totalCount / currentLimit
            )

        return res.status(200).json({
            properties: allproperties,

            pagination: {
                currentPage,
                totalPages,
                totalCount,
                limit: currentLimit
            }
        })
    }
    catch (e) {
        console.error("Get all properties error:", e)

        return res.status(500).json({
            message:
                "Something went wrong on our side"
        })
    }
}


// ============================================================
// GET ONE PROPERTY
// ============================================================

async function getoneproperty(req, res) {
    const { id } = req.params

    try {
        if (!id) {
            return res.status(400).json({
                message: "Property ID is required"
            })
        }

        const property =
            await rentalmodel
                .findById(id)
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

        return res.status(200).json(property)
    }
    catch (e) {
        console.error("Get property error:", e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


// ============================================================
// UPDATE PROPERTY
// ============================================================

async function updateproperty(req, res) {
    const { id } = req.params

    try {
        if (!id) {
            return res.status(400).json({
                message: "Property ID is required"
            })
        }

        const propertyToEdit =
            req.property

        if (!propertyToEdit) {
            return res.status(404).json({
                message: "Property not found"
            })
        }

        const {
            title,
            description,
            type,
            price,
            location,
            rooms,
            furnished,
            genderPreference,
            waterSupply,
            amenities
        } = req.body

        // --------------------------------------------------------
        // Basic fields
        // --------------------------------------------------------

        if (title !== undefined) {
            propertyToEdit.title = title
        }

        if (description !== undefined) {
            propertyToEdit.description =
                description
        }

        if (type !== undefined) {
            propertyToEdit.type = type
        }

        if (price !== undefined) {
            const parsedPrice = Number(price)

            if (!Number.isFinite(parsedPrice)) {
                return res.status(400).json({
                    message:
                        "price must be a valid number"
                })
            }

            propertyToEdit.price =
                parsedPrice
        }

        // --------------------------------------------------------
        // Rooms
        // --------------------------------------------------------

        if (rooms !== undefined) {
            propertyToEdit.rooms = rooms
        }

        // --------------------------------------------------------
        // Furnished
        // --------------------------------------------------------

        if (furnished !== undefined) {
            propertyToEdit.furnished =
                furnished
        }

        // --------------------------------------------------------
        // Gender preference
        // --------------------------------------------------------

        if (genderPreference !== undefined) {
            propertyToEdit.genderPreference =
                genderPreference
        }

        // --------------------------------------------------------
        // Water supply
        // --------------------------------------------------------

        if (waterSupply !== undefined) {
            propertyToEdit.waterSupply =
                waterSupply
        }

        // --------------------------------------------------------
        // Amenities
        // --------------------------------------------------------

        if (amenities !== undefined) {
            let finalAmenities = amenities

            if (typeof amenities === "string") {
                try {
                    finalAmenities =
                        JSON.parse(amenities)
                }
                catch {
                    finalAmenities =
                        [amenities]
                }
            }

            if (!Array.isArray(finalAmenities)) {
                return res.status(400).json({
                    message:
                        "amenities must be an array"
                })
            }

            propertyToEdit.amenities =
                finalAmenities
        }

        // --------------------------------------------------------
        // Location
        // --------------------------------------------------------

        if (location !== undefined) {
            let parsedLocation

            try {
                parsedLocation =
                    typeof location === "string"
                        ? JSON.parse(location)
                        : location
            }
            catch {
                return res.status(400).json({
                    message:
                        'location must be valid JSON'
                })
            }

            if (
                !parsedLocation ||
                !Array.isArray(
                    parsedLocation.coordinates
                ) ||
                parsedLocation.coordinates.length !== 2
            ) {
                return res.status(400).json({
                    message:
                        "location coordinates must contain [lng, lat]"
                })
            }

            const longitude =
                Number(
                    parsedLocation.coordinates[0]
                )

            const latitude =
                Number(
                    parsedLocation.coordinates[1]
                )

            if (
                !Number.isFinite(longitude) ||
                !Number.isFinite(latitude)
            ) {
                return res.status(400).json({
                    message:
                        "longitude and latitude must be valid numbers"
                })
            }

            if (
                longitude < -180 ||
                longitude > 180 ||
                latitude < -90 ||
                latitude > 90
            ) {
                return res.status(400).json({
                    message:
                        "Invalid longitude or latitude"
                })
            }

            propertyToEdit.location = {
                type: "Point",
                coordinates: [
                    longitude,
                    latitude
                ],
                address:
                    parsedLocation.address
            }
        }

        // --------------------------------------------------------
        // Replace images
        // --------------------------------------------------------

        if (
            req.files &&
            req.files.length > 0
        ) {
            const newImages =
                await uploadMultipleImages(
                    req.files
                )

            // Delete old Cloudinary images
            if (
                propertyToEdit.images &&
                propertyToEdit.images.length > 0
            ) {
                await Promise.all(
                    propertyToEdit.images.map(
                        async (img) => {
                            if (!img.publicId) {
                                return
                            }

                            try {
                                await cloudinary
                                    .uploader
                                    .destroy(
                                        img.publicId
                                    )
                            }
                            catch (e) {
                                console.error(
                                    `Failed to delete Cloudinary image ${img.publicId}:`,
                                    e
                                )
                            }
                        }
                    )
                )
            }

            propertyToEdit.images =
                newImages
        }

        // --------------------------------------------------------
        // Save
        // --------------------------------------------------------

        const updatedProperty =
            await propertyToEdit.save()

        return res.status(200).json({
            message:
                "Property updated successfully",
            updatedProperty
        })
    }
    catch (e) {
        console.error("Update property error:", e)

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

async function deleteproperty(req, res) {
    try {
        const propToDelete =
            req.property

        if (!propToDelete) {
            return res.status(404).json({
                message:
                    "Property couldn't be found to delete"
            })
        }

        // --------------------------------------------------------
        // Delete images from Cloudinary
        // --------------------------------------------------------

        if (
            propToDelete.images &&
            propToDelete.images.length > 0
        ) {
            await Promise.all(
                propToDelete.images.map(
                    async (img) => {
                        if (!img.publicId) {
                            return
                        }

                        try {
                            await cloudinary
                                .uploader
                                .destroy(
                                    img.publicId
                                )
                        }
                        catch (e) {
                            console.error(
                                `Failed to delete Cloudinary image ${img.publicId}:`,
                                e
                            )
                        }
                    }
                )
            )
        }

        // --------------------------------------------------------
        // Delete property
        // --------------------------------------------------------

        await propToDelete.deleteOne()

        return res.status(200).json({
            message: "Deleted property",
            propToDelete
        })
    }
    catch (e) {
        console.error("Delete property error:", e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


// ============================================================
// GET MY PROPERTIES
// ============================================================

async function getmyproperties(req, res) {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({
                message: "Unauthorized"
            })
        }

        const myproperties =
            await rentalmodel
                .find({
                    owner: req.user.id
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
    }
    catch (e) {
        console.error(
            "Get my properties error:",
            e
        )

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


// ============================================================
// GET NEARBY PROPERTIES
// ============================================================

async function getnearbyproperties(req, res) {
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

    // --------------------------------------------------------
    // Validate coordinates
    // --------------------------------------------------------

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
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude)
    ) {
        return res.status(400).json({
            message:
                "longitude and latitude must be valid numbers"
        })
    }

    if (
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
    ) {
        return res.status(400).json({
            message:
                "Invalid longitude or latitude"
        })
    }

    // --------------------------------------------------------
    // Radius
    // MongoDB uses meters.
    // API receives kilometers.
    // --------------------------------------------------------

    let maxDistance = 5000

    if (radius !== undefined) {
        const radiusInKm = Number(radius)

        if (
            !Number.isFinite(radiusInKm) ||
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

    // --------------------------------------------------------
    // Pagination
    // --------------------------------------------------------

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
        (currentPage - 1) * currentLimit

    // --------------------------------------------------------
    // Build filters
    // --------------------------------------------------------

    const query = {}

    if (
        minPrice !== undefined ||
        maxPrice !== undefined
    ) {
        query.price = {}

        if (minPrice !== undefined) {
            const min = Number(minPrice)

            if (!Number.isFinite(min)) {
                return res.status(400).json({
                    message:
                        "minPrice must be a valid number"
                })
            }

            query.price.$gte = min
        }

        if (maxPrice !== undefined) {
            const max = Number(maxPrice)

            if (!Number.isFinite(max)) {
                return res.status(400).json({
                    message:
                        "maxPrice must be a valid number"
                })
            }

            query.price.$lte = max
        }
    }

    if (search) {
        query.title = {
            $regex: search,
            $options: "i"
        }
    }

    try {
        // --------------------------------------------------------
        // $geoNear MUST be the first stage
        // --------------------------------------------------------

        const geoNearStage = {
            $geoNear: {
                near: {
                    type: "Point",
                    coordinates: [
                        longitude,
                        latitude
                    ]
                },

                distanceField: "distance",

                maxDistance,

                spherical: true,

                query
            }
        }

        // --------------------------------------------------------
        // Count matching properties
        // --------------------------------------------------------

        const countResult =
            await rentalmodel.aggregate([
                geoNearStage,
                {
                    $count: "total"
                }
            ])

        const totalCount =
            countResult.length > 0
                ? countResult[0].total
                : 0

        const totalPages =
            Math.ceil(
                totalCount / currentLimit
            )

        // --------------------------------------------------------
        // Actual property pipeline
        // --------------------------------------------------------

        const pipeline = [
            geoNearStage
        ]

        // --------------------------------------------------------
        // Sorting
        // --------------------------------------------------------

        if (sort === "price_asc") {
            pipeline.push({
                $sort: {
                    price: 1
                }
            })
        }
        else if (sort === "price_desc") {
            pipeline.push({
                $sort: {
                    price: -1
                }
            })
        }
        else if (sort === "newest") {
            pipeline.push({
                $sort: {
                    createdAt: -1
                }
            })
        }
        else if (sort === "oldest") {
            pipeline.push({
                $sort: {
                    createdAt: 1
                }
            })
        }

        // --------------------------------------------------------
        // Pagination
        // --------------------------------------------------------

        pipeline.push(
            {
                $skip: skip
            },
            {
                $limit: currentLimit
            }
        )

        // --------------------------------------------------------
        // Execute aggregation
        // --------------------------------------------------------

        const nearbyproperties =
            await rentalmodel.aggregate(
                pipeline
            )

        // --------------------------------------------------------
        // Populate owner manually
        // because aggregate() doesn't automatically populate
        // --------------------------------------------------------

        await rentalmodel.populate(
            nearbyproperties,
            {
                path: "owner",
                select: "name phone profilePicture"
            }
        )

        return res.status(200).json({
            properties:
                nearbyproperties,

            pagination: {
                currentPage,
                totalPages,
                totalCount,
                limit: currentLimit
            }
        })
    }
    catch (e) {
        console.error(
            "Nearby properties error:",
            e
        )

        return res.status(500).json({
            message:
                "Something went wrong on our side"
        })
    }
}


// ============================================================
// GET PROPERTIES INSIDE POLYGON
// ============================================================

async function getpropertiesinpolygon(req, res) {
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

        // --------------------------------------------------------
        // Validate polygon
        // --------------------------------------------------------

        if (
            !Array.isArray(polygon) ||
            polygon.length < 4
        ) {
            return res.status(400).json({
                message:
                    "A closed polygon with at least 4 points is required"
            })
        }

        // --------------------------------------------------------
        // Validate every coordinate
        // --------------------------------------------------------

        for (const point of polygon) {
            if (
                !Array.isArray(point) ||
                point.length !== 2
            ) {
                return res.status(400).json({
                    message:
                        "Each polygon point must be [lng, lat]"
                })
            }

            const longitude = Number(point[0])
            const latitude = Number(point[1])

            if (
                !Number.isFinite(longitude) ||
                !Number.isFinite(latitude)
            ) {
                return res.status(400).json({
                    message:
                        "Polygon coordinates must be valid numbers"
                })
            }

            if (
                longitude < -180 ||
                longitude > 180 ||
                latitude < -90 ||
                latitude > 90
            ) {
                return res.status(400).json({
                    message:
                        "Invalid polygon longitude or latitude"
                })
            }
        }

        // --------------------------------------------------------
        // Check polygon is closed
        // First point must equal last point
        // --------------------------------------------------------

        const firstPoint = polygon[0]
        const lastPoint =
            polygon[polygon.length - 1]

        if (
            Number(firstPoint[0]) !==
            Number(lastPoint[0]) ||
            Number(firstPoint[1]) !==
            Number(lastPoint[1])
        ) {
            return res.status(400).json({
                message:
                    "Polygon must be closed. First and last points must be the same."
            })
        }

        // --------------------------------------------------------
        // Base geo filter
        // --------------------------------------------------------

        const filter = {
            location: {
                $geoWithin: {
                    $geometry: {
                        type: "Polygon",
                        coordinates: [polygon]
                    }
                }
            }
        }

        // --------------------------------------------------------
        // Price filter
        // --------------------------------------------------------

        if (
            minPrice !== undefined ||
            maxPrice !== undefined
        ) {
            filter.price = {}

            if (minPrice !== undefined) {
                const min = Number(minPrice)

                if (!Number.isFinite(min)) {
                    return res.status(400).json({
                        message:
                            "minPrice must be a valid number"
                    })
                }

                filter.price.$gte = min
            }

            if (maxPrice !== undefined) {
                const max = Number(maxPrice)

                if (!Number.isFinite(max)) {
                    return res.status(400).json({
                        message:
                            "maxPrice must be a valid number"
                    })
                }

                filter.price.$lte = max
            }
        }

        // --------------------------------------------------------
        // Search
        // --------------------------------------------------------

        if (search) {
            filter.title = {
                $regex: search,
                $options: "i"
            }
        }

        // --------------------------------------------------------
        // Sorting
        // --------------------------------------------------------

        let sortOption = {}

        if (sort === "price_asc") {
            sortOption.price = 1
        }
        else if (sort === "price_desc") {
            sortOption.price = -1
        }
        else if (sort === "newest") {
            sortOption.createdAt = -1
        }
        else if (sort === "oldest") {
            sortOption.createdAt = 1
        }

        // --------------------------------------------------------
        // Pagination
        // --------------------------------------------------------

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
            (currentPage - 1) * currentLimit

        // --------------------------------------------------------
        // Query
        // --------------------------------------------------------

        const propertiesinpolygon =
            await rentalmodel
                .find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(currentLimit)
                .populate(
                    "owner",
                    "name phone profilePicture"
                )

        // --------------------------------------------------------
        // Count
        // --------------------------------------------------------

        const totalCount =
            await rentalmodel.countDocuments(
                filter
            )

        const totalPages =
            Math.ceil(
                totalCount / currentLimit
            )

        return res.status(200).json({
            properties:
                propertiesinpolygon,

            pagination: {
                currentPage,
                totalPages,
                totalCount,
                limit: currentLimit
            }
        })
    }
    catch (e) {
        console.error(
            "Polygon properties error:",
            e
        )

        return res.status(500).json({
            message:
                "Something went wrong on our side"
        })
    }
}


// ============================================================
// EXPORTS
// ============================================================

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