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

module.exports = { createproperty, getallproperties }