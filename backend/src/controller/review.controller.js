const rentalmodel = require("../model/rental.model")
const reviewmodel = require("../model/review.model")

async function createreview() {
    try {
        const { rating, comment } = req.user.body
        const propertyid = req.params.propertyid
        const reviewerid = req.user.id

        const property = await rentalmodel.findById(propertyid)

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

    }
    catch (e) {

    }
}