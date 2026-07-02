const rentalmodel = require("../model/rental.model")
const reviewmodel = require("../model/review.model")

async function createreview(req, res) {
    try {
        const { rating, comment } = req.body
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


        const review = await reviewmodel.create({
            property: propertyid,
            reviewer: reviewerid,
            rating, comment
        })
        res.status(201).json({ message: "Review created", review });
    }
    catch (e) {
        console.error(e)
        if (e.code === 11000) {
            return res.status(400).json({ message: "You have already reviewed this property" });
        }
        return res.status(500).json({ message: "Server error", e: error.message });
    }
}

async function getpropertyreviews(req, res) {
    try {
        const propertyid = req.params.propertyid
        const reviews = await reviewmodel.find({ property: propertyid }).populate("reviewer", "name email")
        res.status(200).json({ reviews });
    } catch (e) {
        res.status(500).json({ message: "Server error", error: e.message });
    }
}