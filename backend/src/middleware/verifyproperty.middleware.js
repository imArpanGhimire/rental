const rentalmodel = require("../model/rental.model")

async function verifypropertyowner(req, res, next) {
    const { id } = req.params
    const propertyexists = await rentalmodel.findById(id)

    if (!propertyexists) {
        return res.status(404).json({ message: "Property not found" })
    }

    if (propertyexists.owner.toString() !== req.user.id) {
        return res.status(403).json({
            messsage: "You don't own this property"
        })
    }

    req.property = propertyexists
    next()


}


module.exports = verifypropertyowner