const express = require("express")
const router = express.Router()

const favoritecontroller = require("../controller/favorites.controller")

router.post("/add-forlater", favoritecontroller.saveForlater)
router.post("/remove-forlater", favoritecontroller.removeForlater)




module.exports = router
