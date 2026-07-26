const express = require("express")
const router = express.Router()

const authcontroller = require("../controller/auth.controller")

router.post("/register", authcontroller.registeruser)
router.post("/login", authcontroller.loginuser)
router.post("/logout", authcontroller.logoutuser)

module.exports = router