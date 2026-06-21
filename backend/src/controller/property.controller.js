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
            message: "Property has been added"
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
    try {
        const allproperties = await rentalmodel.find().populate("owner", "name")
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

        // todo    yo tala ko le pani same kaam garne ho 

        // const updatedProperty = await rentalmodel.findByIdAndUpdate(
        //     id, { title, description, location, price, images }, { new: true }
        // )

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


module.exports = { createproperty, getallproperties, getoneproperty, updateproperty, deleteproperty, getmyproperties }