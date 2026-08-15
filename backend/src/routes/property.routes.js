const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/auth.middleware")
const ownershipMiddleware = require("../middleware/owner.middleware")
const verifyPropertyMiddleware = require("../middleware/verifyproperty.middleware")
const upload = require("../middleware/upload.middleware")

const propertycontroller = require("../controller/property.controller")

function handleUpload(req, res, next) {
    upload.array("images", 5)(
        req,
        res,
        function (err) {
            if (err) {
                console.error("UPLOAD ERROR:", err)

                return res.status(400).json({
                    message: "Image upload failed",
                    error: err.message || err
                })
            }

            next()
        }
    )
}

function handleSingleUpload(req, res, next) {
    upload.single("image")(
        req,
        res,
        function (err) {
            if (err) {
                console.error("UPLOAD ERROR:", err)

                return res.status(400).json({
                    message: "Image upload failed",
                    error: err.message || err
                })
            }

            next()
        }
    )
}

router.post(
    "/upload-image",
    authMiddleware,
    ownershipMiddleware,
    handleSingleUpload,
    propertycontroller.uploadimage
)

router.post(
    "/add-property",
    authMiddleware,
    ownershipMiddleware,
    handleUpload,
    propertycontroller.createproperty
)

router.get(
    "/get-all-properties",
    propertycontroller.getallproperties
)

router.get(
    "/nearby",
    propertycontroller.getnearbyproperties
)

router.post(
    "/polygon-search",
    propertycontroller.getpropertiesinpolygon
)

router.get(
    "/get-property/:id",
    propertycontroller.getoneproperty
)

router.put(
    "/update-property/:id",
    authMiddleware,
    ownershipMiddleware,
    verifyPropertyMiddleware,
    handleUpload,
    propertycontroller.updateproperty
)

router.delete(
    "/delete-property/:id",
    authMiddleware,
    ownershipMiddleware,
    verifyPropertyMiddleware,
    propertycontroller.deleteproperty
)

router.get(
    "/view-my-listings",
    authMiddleware,
    ownershipMiddleware,
    propertycontroller.getmyproperties
)

module.exports = router