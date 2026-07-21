const express = require("express")
const router = express.Router()

const favoritecontroller = require("../controller/favorites.controller")
const authmiddleware = require("../middleware/auth.middleware")

router.post("/add-forlater/:propertyid", authmiddleware, favoritecontroller.saveForlater)
router.post("/remove-forlater/:propertyid", authmiddleware, favoritecontroller.removeForlater)
router.get("/get-forlater", authmiddleware, favoritecontroller.getForlater)

module.exports = router
