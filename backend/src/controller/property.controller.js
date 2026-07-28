const rentalmodel = require("../model/rental.model")


async function createproperty(req, res) {
    const {
        title, description, price, type,
        rooms, furnished, genderPreference, waterSupply
    } = req.body
    const owner = req.user.id

    if (!title || !description || !price || !owner || !req.body.location || !type) {
        return res.status(400).json({
            message: "title, description, price, location, and type are required"
        })
    }

    let parsedLocation
    try {
        parsedLocation = JSON.parse(req.body.location)
    }
    catch (e) {
        return res.status(400).json({
            message: "location must be valid JSON, e.g. {\"type\":\"Point\",\"coordinates\":[lng,lat],\"address\":\"...\"}"
        })
    }

    const location = {
        type: "Point",
        coordinates: parsedLocation.coordinates,
        address: parsedLocation.address
    }

    const images = req.files ? req.files.map(file => file.path) : []

    try {
        const property = await rentalmodel.create({
            title,
            description,
            price,
            type,
            owner,
            location,
            images,
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
            message: e.message || "something went wrong on our side"
        })
    }
}

async function getallproperties(req, res) {
    const { minPrice, maxPrice, search } = req.query
    const filter = {}

    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (search) {
        filter.title = { $regex: search, $options: "i" }
    }

    try {
        const allproperties = await rentalmodel.find(filter).populate("owner", "name")
        return res.status(200).json(allproperties)
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "something went wrong on our side"
        })
    }
}

async function getoneproperty(req, res) {
    const { id } = req.params
    try {
        const property = await rentalmodel.findById(id).populate("owner", "name")

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
        title, description, price, location, type,
        rooms, furnished, genderPreference, waterSupply
    } = req.body

    const propertyToEdit = req.property

    try {

        if (!id) {
            return res.status(404).json({
                message: "The property you are trying to update couldn't be found"
            })
        }


        if (!propertyToEdit) {
            return res.status(404).json({
                message: "property not found"
            })
        }


        if (title) propertyToEdit.title = title
        if (description) propertyToEdit.description = description
        if (price) propertyToEdit.price = price
        if (type) propertyToEdit.type = type
        if (rooms) propertyToEdit.rooms = rooms
        if (furnished !== undefined) propertyToEdit.furnished = furnished
        if (genderPreference) propertyToEdit.genderPreference = genderPreference
        if (waterSupply) propertyToEdit.waterSupply = waterSupply

        if (location) {
            try {
                const parsedLocation = JSON.parse(location)
                propertyToEdit.location = {
                    type: "Point",
                    coordinates: parsedLocation.coordinates,
                    address: parsedLocation.address
                }
            }
            catch (e) {
                return res.status(400).json({
                    message: "location must be valid JSON, e.g. {\"type\":\"Point\",\"coordinates\":[lng,lat],\"address\":\"...\"}"
                })
            }
        }

        // only touch images if new files were actually uploaded in this request;
        // otherwise leave the existing images untouched
        if (req.files && req.files.length > 0) {
            propertyToEdit.images = req.files.map(file => file.path)
        }

        const updatedProperty = await propertyToEdit.save()

        return res.status(200).json({
            message: "property updated successfully",
            updatedProperty
        })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({
            message: e.message || "Internal server error"
        })
    }
}

async function deleteproperty(req, res) {
    const { id } = req.params

    try {
        const propToDelete = req.property

        if (!propToDelete) {
            return res.status(404).json({
                message: "Property couldn't be found to delete"
            })
        }

        const deletedProperty = await propToDelete.deleteOne()
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

        const myproperties = await rentalmodel.find({ owner: req.user.id })

        return res.status(200).json({
            message: "Here are the listing of your properties",
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
    const { lng, lat, radius, minPrice, maxPrice } = req.query

    if (!lng || !lat) {
        return res.status(400).json({
            message: "longitude and latitude are required"
        })
    }

    const maxDistance = radius ? Number(radius) * 1000 : 5000 // radius in km -> meters, default 5km

    const filter = {
        location: {
            $near: {
                $geometry: {
                    type: "Point",
                    coordinates: [Number(lng), Number(lat)]
                },
                $maxDistance: maxDistance
            }
        }
    }

    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    try {
        const nearbyproperties = await rentalmodel.find(filter).populate("owner", "name")

        return res.status(200).json(nearbyproperties)
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


module.exports = { createproperty, getallproperties, getoneproperty, updateproperty, deleteproperty, getmyproperties, getnearbyproperties }