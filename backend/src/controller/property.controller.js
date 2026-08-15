const rentalmodel = require("../model/rental.model")
const cloudinary = require("../config/cloudinary")
const streamifier = require("streamifier")

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

async function uploadimage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "No image file provided"
            })
        }

        const result =
            await uploadBufferToCloudinary(
                req.file.buffer
            )

        return res.status(201).json({
            url: result.secure_url,
            publicId: result.public_id
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Image upload failed"
        })
    }
}

async function uploadMultipleImages(files) {
    if (!files || files.length === 0) {
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
            publicId: result.public_id
        })
    }

    return uploadedImages
}

async function createproperty(req, res) {
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

    const owner = req.user.id

    if (
        !title ||
        !description ||
        !price ||
        !owner ||
        !req.body.location ||
        !type
    ) {
        return res.status(400).json({
            message:
                "title, description, price, location, and type are required"
        })
    }

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

    const location = {
        type: "Point",
        coordinates: parsedLocation.coordinates,
        address: parsedLocation.address
    }

    let finalImages = []

    try {
        /*
         * If images were uploaded directly through this request,
         * upload them to Cloudinary.
         */
        if (req.files && req.files.length > 0) {
            finalImages =
                await uploadMultipleImages(req.files)
        }

        /*
         * If frontend already uploaded images using /upload-image,
         * it can send the returned images in req.body.images.
         */
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

        const property =
            await rentalmodel.create({
                title,
                description,
                type,
                price,
                owner,
                location,
                images: finalImages,
                amenities: finalAmenities || [],
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
        console.error(e)

        return res.status(400).json({
            message:
                e.message ||
                "something went wrong on our side"
        })
    }
}

async function getallproperties(req, res) {
    const {
        minPrice,
        maxPrice,
        search,
        sort,
        page,
        limit
    } = req.query

    const filter = {}

    if (minPrice || maxPrice) {
        filter.price = {}

        if (minPrice) {
            filter.price.$gte = Number(minPrice)
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice)
        }
    }

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i"
        }
    }

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

    const currentPage =
        Number(page) || 1

    const currentLimit =
        Number(limit) || 10

    const skip =
        (currentPage - 1) * currentLimit

    try {
        const allproperties =
            await rentalmodel
                .find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(currentLimit)
                .populate("owner", "name phone")

        const totalCount =
            await rentalmodel.countDocuments(filter)

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
        console.error(e)

        return res.status(500).json({
            message:
                "something went wrong on our side"
        })
    }
}

async function getoneproperty(req, res) {
    const { id } = req.params

    try {
        const property =
            await rentalmodel
                .findById(id)
                .populate(
                    "owner",
                    "name phone profilePicture"
                )

        if (!property) {
            return res.status(404).json({
                message: "Couldn't find that property"
            })
        }

        return res.status(200).json(property)
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function updateproperty(req, res) {
    const { id } = req.params

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

    const propertyToEdit =
        req.property

    try {
        if (!id) {
            return res.status(404).json({
                message:
                    "The property you are trying to update couldn't be found"
            })
        }

        if (!propertyToEdit) {
            return res.status(404).json({
                message: "property not found"
            })
        }

        if (title) {
            propertyToEdit.title = title
        }

        if (description) {
            propertyToEdit.description =
                description
        }

        if (type) {
            propertyToEdit.type = type
        }

        if (price) {
            propertyToEdit.price = price
        }

        if (rooms !== undefined) {
            propertyToEdit.rooms = rooms
        }

        if (furnished !== undefined) {
            propertyToEdit.furnished =
                furnished
        }

        if (genderPreference) {
            propertyToEdit.genderPreference =
                genderPreference
        }

        if (waterSupply) {
            propertyToEdit.waterSupply =
                waterSupply
        }

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

            propertyToEdit.amenities =
                finalAmenities
        }

        if (location) {
            try {
                const parsedLocation =
                    typeof location === "string"
                        ? JSON.parse(location)
                        : location

                propertyToEdit.location = {
                    type: "Point",
                    coordinates:
                        parsedLocation.coordinates,
                    address:
                        parsedLocation.address
                }
            }
            catch (e) {
                return res.status(400).json({
                    message:
                        'location must be valid JSON, e.g. {"type":"Point","coordinates":[lng,lat],"address":"..."}'
                })
            }
        }

        /*
         * Only replace existing images if new
         * files were actually uploaded.
         */
        if (
            req.files &&
            req.files.length > 0
        ) {
            const newImages =
                await uploadMultipleImages(
                    req.files
                )

            /*
             * Delete old Cloudinary images
             * before replacing them.
             */
            if (
                propertyToEdit.images &&
                propertyToEdit.images.length > 0
            ) {
                await Promise.all(
                    propertyToEdit.images.map(
                        async (img) => {
                            if (img.publicId) {
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
                        }
                    )
                )
            }

            propertyToEdit.images =
                newImages
        }

        const updatedProperty =
            await propertyToEdit.save()

        return res.status(200).json({
            message:
                "property updated successfully",
            updatedProperty
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message:
                e.message ||
                "Internal server error"
        })
    }
}

async function deleteproperty(req, res) {
    const { id } = req.params

    try {
        const propToDelete =
            req.property

        if (!propToDelete) {
            return res.status(404).json({
                message:
                    "Property couldn't be found to delete"
            })
        }

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

        await propToDelete.deleteOne()

        return res.status(200).json({
            message: "deleted property",
            propToDelete
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function getmyproperties(req, res) {
    try {
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
                "Here are the listing of your properties",
            myproperties
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

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

    if (!lng || !lat) {
        return res.status(400).json({
            message:
                "longitude and latitude are required"
        })
    }

    /*
     * radius is supplied in kilometers.
     * MongoDB $maxDistance uses meters.
     */
    const maxDistance =
        radius
            ? Number(radius) * 1000
            : 5000

    const filter = {
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [
                        Number(lng),
                        Number(lat)
                    ]
                },

                $maxDistance:
                    maxDistance
            }
        }
    }

    if (minPrice || maxPrice) {
        filter.price = {}

        if (minPrice) {
            filter.price.$gte =
                Number(minPrice)
        }

        if (maxPrice) {
            filter.price.$lte =
                Number(maxPrice)
        }
    }

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i"
        }
    }

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

    const currentPage =
        Number(page) || 1

    const currentLimit =
        Number(limit) || 10

    const skip =
        (currentPage - 1) * currentLimit

    try {
        const nearbyproperties =
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
        console.error(e)

        return res.status(500).json({
            message:
                "something went wrong on our side"
        })
    }
}

async function getpropertiesinpolygon(req, res) {
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
        !polygon ||
        !Array.isArray(polygon) ||
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
                    type: "Polygon",
                    coordinates: [polygon]
                }
            }
        }
    }

    if (minPrice || maxPrice) {
        filter.price = {}

        if (minPrice) {
            filter.price.$gte =
                Number(minPrice)
        }

        if (maxPrice) {
            filter.price.$lte =
                Number(maxPrice)
        }
    }

    if (search) {
        filter.title = {
            $regex: search,
            $options: "i"
        }
    }

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

    const currentPage =
        Number(page) || 1

    const currentLimit =
        Number(limit) || 10

    const skip =
        (currentPage - 1) * currentLimit

    try {
        const propertiesinpolygon =
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
        console.error(e)

        return res.status(500).json({
            message:
                "something went wrong on our side"
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