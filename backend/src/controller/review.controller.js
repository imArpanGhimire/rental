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
        if (property.owner.toString() === reviewerid.toString()) {
            return res.status(403).json({ message: "You cannot review your own property" });
        }

        if (req.user.role !== "renter") {
            return res.status(403).json({
                message: "only renters can write reviews"
            })
        }


        const review = await rentalmodel.create({
            property: propertyid,
            reviewer: reviewerid,
            rating, comment
        })
        res.status(201).json({ message: "Review created", review });
    }
    catch (e) {
        console.error(e)
        return res.status(500).json({ message: "Server error", error: error.message });
    }
}