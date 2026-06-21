const express = require("express")
const router = express.Router()


const propertycontroller = require("../controller/property.controller")
const authmiddleware = require("../middleware/auth.middleware")

router.post("/add-property", authmiddleware, propertycontroller.createproperty)
router.get("/get-all-properties", authmiddleware, propertycontroller.getallproperties)

module.exports = router