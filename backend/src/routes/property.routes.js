const express = require("express")
const router = express.Router()
// middlewares 
const authMiddleware = require("../middleware/auth.middleware")
const ownershipMiddleware = require("../middleware/owner.middleware")
const verifyPropertyMiddleware = require("../middleware/verifyproperty.middleware")
const verifypropertyowner = require("../middleware/verifyproperty.middleware")
const upload = require("../middleware/upload.middleware")
// controllers
const propertycontroller = require("../controller/property.controller")

// wraps multer/cloudinary upload so real errors are visible instead of crashing to a blank HTML page
function handleUpload(req, res, next) {
    console.log("HANDLE UPLOAD STARTED")
    upload.array("images", 5)(req, res, function (err) {
        if (err) {
            console.error("UPLOAD ERROR:", err)
            return res.status(400).json({
                message: "Image upload failed",
                error: err.message || err
            })
        }
        console.log("UPLOAD SUCCEEDED")
        next()
    })
}

router.post("/add-property", authMiddleware, ownershipMiddleware, handleUpload, propertycontroller.createproperty)
router.get("/get-all-properties", propertycontroller.getallproperties)
router.get("/nearby", propertycontroller.getnearbyproperties)
router.get("/get-property/:id", propertycontroller.getoneproperty)
router.put("/update-property/:id", authMiddleware, ownershipMiddleware, verifyPropertyMiddleware, handleUpload, propertycontroller.updateproperty)
router.delete("/delete-property/:id", authMiddleware, ownershipMiddleware, verifyPropertyMiddleware, propertycontroller.deleteproperty)
router.get("/view-my-listings", authMiddleware, ownershipMiddleware, verifypropertyowner, propertycontroller.getmyproperties)

module.exports = router