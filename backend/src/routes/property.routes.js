const express = require("express")
const router = express.Router()

// middlewares 
const authMiddleware = require("../middleware/auth.middleware")
const ownershipMiddleware = require("../middleware/owner.middleware")
const verifyPropertyMiddleware = require("../middleware/verifyproperty.middleware")

// controllers
const propertycontroller = require("../controller/property.controller")


router.post("/add-property", authMiddleware, ownershipMiddleware, propertycontroller.createproperty)
router.get("/get-all-properties", propertycontroller.getallproperties)

router.get("/nearby", propertycontroller.getnearbyproperties)

router.get("/get-property/:id", propertycontroller.getoneproperty)
router.put("/update-property/:id", authMiddleware, ownershipMiddleware, verifyPropertyMiddleware, propertycontroller.updateproperty)
router.delete("/delete-property/:id", authMiddleware, ownershipMiddleware, verifyPropertyMiddleware, propertycontroller.deleteproperty)
router.get("/view-my-listings", authMiddleware, propertycontroller.getmyproperties)

module.exports = router