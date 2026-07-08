const favoritemodel = require("../model/favorites.model");
const rentalmodel = require("../model/rental.model");

async function saveForlater(req, res) {
    try {
        const propertyid = req.params.propertyid;
        const property = await rentalmodel.findById(propertyid);

        const renterid = req.user.id;

        if (!property) {
            return res.status(404).json({
                message: "Couldn't find that property",
            });
        }

        if (req.user.role !== "renter") {
            return res.status(403).json({
                message: "Only renters can save properties",
            });
        }

        // check if its already saved
        const alreadysaved = await favoritemodel.findOne({
            renter: renterid,
            property: propertyid,
        });

        if (alreadysaved) {
            return res.status(400).json({
                message: "Property already saved",
            });
        }

        // save favorite
        const favoriteproperty = await favoritemodel.create({
            renter: renterid,
            property: propertyid,
        });
        return res.status(201).json({
            message: "Property saved successfully",
            favoriteproperty,
        });
    } catch (e) {
        console.error(e);

        return res.status(500).json({
            message: "Internal server error",
            error: e.message,
        });
    }
}

async function removeForlater(req, res) {
    try {
        const propertyid = req.params.propertyid;
        const renterid = req.user.id;

        const deletedfavorite = await favoritemodel.findOneAndDelete({
            property: propertyid,
            renter: renterid,
        });

        if (!deletedfavorite) {
            return res.status(404).json({
                message: "Favorite not found",
            });
        }

        return res.status(200).json({
            message: "Removed from favorites",
            deletedfavorite,
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({
            message: "Server error",
        });
    }
}

module.exports = { saveForlater, removeForlater };
