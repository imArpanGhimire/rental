const express = require("express")
const router = express.Router()


const propertycontroller = require("../controller/property.controller")
const authmiddleware = require("../middleware/auth.middleware")
const ownershipmiddleware = require("../middleware/owner.middleware")

router.post("/add-property", authmiddleware, ownershipmiddleware, propertycontroller.createproperty)
router.get("/get-all-properties", propertycontroller.getallproperties)
router.get("/get-property/:id", propertycontroller.getoneproperty)

module.exports = router