const rentalmodel = require("../model/rental.model")

async function verifypropertyowner(req, res, next) {
    const { id } = req.params
    try {
        const propertyexists = await rentalmodel.findById(id)

        if (!propertyexists) {
            return res.status(404).json({ message: "Property not found" })
        }

        if (propertyexists.owner.toString() !== req.user.id) {
            return res.status(403).json({
                message: "You don't own this property"
            })
        }

        req.property = propertyexists
        next()
    }
    catch (e) {
        console.error(e)
        return res.status(400).json({ message: "Invalid property id" })
    }

}


module.exports = verifypropertyowner