const rentalmodel = require("../model/rental.model")


async function createproperty(req, res) {
    const { title, description, price, images, location } = req.body
    const owner = req.user.id

    if (!title || !description || !price || !owner || !location) {
        return res.status(400).json({
            message: "All the information are required except images"
        })
    }

    try {
        const property = await rentalmodel.create({ title, description, price, owner, location, images })

        return res.status(201).json({
            message: "Property has been added",
            property
        })
    }
    catch (e) {
        console.error(e)
        return res.status(400).json({
            message: "something went wrong on our side"
        })
    }
}

async function getallproperties(req, res) {
    const { minPrice, maxPrice, search, sort } = req.query
    const filter = {}

    if (minPrice || maxPrice) {
        filter.price = {}
        if (minPrice) filter.price.$gte = Number(minPrice)
        if (maxPrice) filter.price.$lte = Number(maxPrice)
    }

    if (search) {
        filter.title = { $regex: search, $options: "i" }
    }

    let sortOption = {}
    if (sort === "price_asc") sortOption.price = 1
    else if (sort === "price_desc") sortOption.price = -1
    else if (sort === "newest") sortOption.createdAt = -1
    else if (sort === "oldest") sortOption.createdAt = 1

    try {
        const allproperties = await rentalmodel.find(filter).sort(sortOption).populate("owner", "name")
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
    const { title, description, price, location, images } = req.body

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
        if (location) propertyToEdit.location = location
        if (images) propertyToEdit.images = images

        const updatedProperty = await propertyToEdit.save()

        return res.status(200).json({
            message: "property updated successfully",
            updatedProperty
        })
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "Internal server error"

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
    const { lng, lat, radius, minPrice, maxPrice, search, sort } = req.query

    if (!lng || !lat || isNaN(lng) || isNaN(lat)) {
        return res.status(400).json({
            message: "valid longitude and latitude are required"
        })
    }

    const maxDistance = radius ? Number(radius) * 1000 : 5000 // radius in km -> meters, default 5km
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
        let nearbyproperties

        if (!sort || sort === "distance") {
            // distance mode: use $near, auto-sorted by distance
            filter.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [Number(lng), Number(lat)]
                    },
                    $maxDistance: maxDistance
                }
            }
            nearbyproperties = await rentalmodel.find(filter).populate("owner", "name")
        } else {
            // price/newest/oldest mode: no $near, just sort
            let sortOption = {}
            if (sort === "price_asc") sortOption.price = 1
            else if (sort === "price_desc") sortOption.price = -1
            else if (sort === "newest") sortOption.createdAt = -1
            else if (sort === "oldest") sortOption.createdAt = 1

            nearbyproperties = await rentalmodel.find(filter).sort(sortOption).populate("owner", "name")
        }

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