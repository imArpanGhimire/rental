const favoritemodel = require("../model/favorites.model")
const rentalmodel = require("../model/rental.model")


async function saveproperty(req, res) {
    const { id } = req.params
    const property = await rentalmodel.findById(id)

    const isrenter = req.user.id

    if (!property) {
        return res.status(404).json({
            message: "Couldn't find that property"
        })
    }

    if (req.user.role !== "renter") {
        return res.status(403).json({
            message: "Only renters can save properties",
        });
    }

}