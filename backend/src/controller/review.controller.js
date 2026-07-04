const rentalmodel = require("../model/rental.model");
const reviewmodel = require("../model/review.model");

async function createreview(req, res) {
    try {
        const { rating, comment } = req.body;
        const propertyid = req.params.propertyid;
        const reviewerid = req.user.id;

        const property = await rentalmodel.findById(propertyid);

        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }
        if (property.owner.toString() === reviewerid.toString()) {
            return res
                .status(403)
                .json({ message: "You cannot review your own property" });
        }

        if (req.user.role !== "renter") {
            return res.status(403).json({
                message: "only renters can write reviews",
            });
        }

        const review = await reviewmodel.create({
            property: propertyid,
            reviewer: reviewerid,
            rating,
            comment,
        });
        res.status(201).json({ message: "Review created", review });
    } catch (e) {
        console.error(e);
        if (e.code === 11000) {
            return res
                .status(400)
                .json({ message: "You have already reviewed this property" });
        }
        return res.status(500).json({ message: "Server error", e: error.message });
    }
}

async function getpropertyreviews(req, res) {
    try {
        const propertyid = req.params.propertyid;
        const reviews = await reviewmodel
            .find({ property: propertyid })
            .populate("reviewer", "name email");
        res.status(200).json({ reviews });
    } catch (e) {
        res.status(500).json({ message: "Server error", error: e.message });
    }
}

async function deletereview(req, res) {
    try {
        const reviewid = req.params.id;
        const deletedreview = await reviewmodel.find({ comment: cmt });

        if (!deletedreview) {
            return res.status(404).json({
                message: "cant find that review",
            });
        }

        if (deletedreview.reviewer.toString() !== req.user.id) {
            return res.status(403).json({
                message: "you can delete only your own reviews",
            });
        }

        const reviewtodel = await reviewmodel.findByIdAndDelete(reviewid);

        return res.status(200).json({
            message: "review deleted",
            reviewtodel,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: "Server error", error: e.message });
    }
}

async function replytoreview(req, res) {
    try {
        const reviewid = req.params.reviewid;
        const { comment } = req.body;

        const review = await reviewmodel.findById(reviewid);
        if (!review) {
            return res.status(404).json({ message: "Review not found" });
        }

        const property = await rentalmodel.findById(review.property);
        if (!property) {
            return res.status(404).json({ message: "Property not found" });
        }

        if (property.owner.toString() !== req.user.id.toString()) {
            return res
                .status(403)
                .json({ message: "Only the property owner can reply to this review" });
        }

        review.ownerReply = {
            comment: comment,
            repliedAt: new Date(),
        };

        await review.save();
        res.status(200).json({ message: "Reply added", review });
    } catch (e) {
        res.status(500).json({ message: "Server error", error: e.message });
    }
}

async function editreply(req, res) {
    try {
        const reviewid = req.params.reviewid;
        const review = await reviewmodel.findById(reviewid);

        const { comment } = req.body;

        if (!review) {
            return res.status(404).json({
                message: "couldn't found the reply",
            });
        }

        const property = await rentalmodel.find(review.property);

        // ownership check garya
        if (property.owner.toString() !== req.user.id.toString()) {
            return res.status(403).json({
                message: "not authorised to edit",
            });
        }

        if (!review.ownerReply || !review.ownerReply.comment) {
            return res.status(400).json({ message: "No existing reply to edit" });
        }

        review.ownerReply.comment = comment;
        review.ownerReply.repliedAt = new Date();

        await review.save();
        res.status(200).json({ message: "Reply updated", review });
    } catch (e) {
        return res.status(500).json({
            message: "internal server error",
            error: e.message,
        });
    }
}

module.exports = {
    createreview,
    getpropertyreviews,
    deletereview,
    replytoreview, editreply
};
