const rentalmodel = require("../model/rental.model");
const reviewmodel = require("../model/review.model");

async function createreview(req, res) {
    try {
        const { rating, comment } = req.body;

        const propertyid = req.params.propertyid;
        const reviewerid = req.user.id;

        if (req.user.role !== "renter") {
            return res.status(403).json({
                message: "Only renters can write reviews",
            });
        }

        const property =
            await rentalmodel.findById(propertyid);

        if (!property) {
            return res.status(404).json({
                message: "Property not found",
            });
        }

        if (
            property.owner.toString() ===
            reviewerid.toString()
        ) {
            return res.status(403).json({
                message:
                    "You cannot review your own property",
            });
        }

        const numericRating =
            Number(rating);

        if (
            !Number.isFinite(numericRating) ||
            numericRating < 1 ||
            numericRating > 5
        ) {
            return res.status(400).json({
                message:
                    "Rating must be between 1 and 5",
            });
        }

        const cleanComment =
            String(comment || "").trim();

        if (!cleanComment) {
            return res.status(400).json({
                message:
                    "Review comment is required",
            });
        }

        const existingReview =
            await reviewmodel.findOne({
                property: propertyid,
                reviewer: reviewerid,
            });

        if (existingReview) {
            return res.status(400).json({
                message:
                    "You have already reviewed this property",
            });
        }

        const review =
            await reviewmodel.create({
                property: propertyid,
                reviewer: reviewerid,
                rating: numericRating,
                comment: cleanComment,
            });

        await review.populate(
            "reviewer",
            "name email",
        );

        return res.status(201).json({
            message: "Review created",
            review,
        });
    } catch (e) {
        console.error(e);

        if (e.code === 11000) {
            return res.status(400).json({
                message:
                    "You have already reviewed this property",
            });
        }

        return res.status(500).json({
            message: "Server error",
            error: e.message,
        });
    }
}

async function getpropertyreviews(
    req,
    res,
) {
    try {
        const propertyid =
            req.params.propertyid;

        const reviews =
            await reviewmodel
                .find({
                    property: propertyid,
                })
                .populate(
                    "reviewer",
                    "name email",
                )
                .sort({
                    createdAt: -1,
                });

        return res.status(200).json({
            reviews,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message,
        });
    }
}

async function deletereview(
    req,
    res,
) {
    try {
        const reviewid =
            req.params.reviewid;

        const review =
            await reviewmodel.findById(
                reviewid,
            );

        if (!review) {
            return res.status(404).json({
                message:
                    "Can't find that review",
            });
        }

        if (
            review.reviewer.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "You can delete only your own reviews",
            });
        }

        await review.deleteOne();

        return res.status(200).json({
            message: "Review deleted",
            reviewtodel: review,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message,
        });
    }
}

/*
 * EXACTLY ONE OWNER REPLY.
 *
 * Renter:
 *   review
 *
 * Owner:
 *   reply
 *
 * End.
 */
async function replytoreview(
    req,
    res,
) {
    try {
        const reviewid =
            req.params.reviewid;

        const cleanComment =
            String(
                req.body.comment || "",
            ).trim();

        if (!cleanComment) {
            return res.status(400).json({
                message:
                    "Reply cannot be empty",
            });
        }

        const review =
            await reviewmodel.findById(
                reviewid,
            );

        if (!review) {
            return res.status(404).json({
                message:
                    "Review not found",
            });
        }

        const property =
            await rentalmodel.findById(
                review.property,
            );

        if (!property) {
            return res.status(404).json({
                message:
                    "Property not found",
            });
        }

        if (
            property.owner.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "Only the property owner can reply to this review",
            });
        }

        /*
         * Prevent multiple owner replies.
         */
        if (
            review.ownerReply?.comment
        ) {
            return res.status(400).json({
                message:
                    "This review already has an owner reply",
            });
        }

        review.ownerReply = {
            comment: cleanComment,
            repliedAt: new Date(),
        };

        await review.save();

        await review.populate(
            "reviewer",
            "name email",
        );

        return res.status(200).json({
            message: "Reply added",
            review,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Server error",
            error: e.message,
        });
    }
}

/*
 * This edits the SAME owner reply.
 * It does not create another conversation level.
 */
async function editreply(req, res) {
    try {
        const reviewid =
            req.params.reviewid;

        const cleanComment =
            String(
                req.body.comment || "",
            ).trim();

        if (!cleanComment) {
            return res.status(400).json({
                message:
                    "Reply cannot be empty",
            });
        }

        const review =
            await reviewmodel.findById(
                reviewid,
            );

        if (!review) {
            return res.status(404).json({
                message:
                    "Review not found",
            });
        }

        const property =
            await rentalmodel.findById(
                review.property,
            );

        if (!property) {
            return res.status(404).json({
                message:
                    "Property not found",
            });
        }

        if (
            property.owner.toString() !==
            req.user.id.toString()
        ) {
            return res.status(403).json({
                message:
                    "Not authorised to edit this reply",
            });
        }

        if (
            !review.ownerReply?.comment
        ) {
            return res.status(400).json({
                message:
                    "No existing reply to edit",
            });
        }

        review.ownerReply.comment =
            cleanComment;

        review.ownerReply.repliedAt =
            new Date();

        await review.save();

        return res.status(200).json({
            message: "Reply updated",
            review,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message:
                "Internal server error",
            error: e.message,
        });
    }
}

module.exports = {
    createreview,
    getpropertyreviews,
    deletereview,
    replytoreview,
    editreply,
};