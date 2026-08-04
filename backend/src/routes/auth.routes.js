const express = require("express")
const router = express.Router()
const authcontroller = require("../controller/auth.controller")
const authmiddleware = require("../middleware/auth.middleware")
router.post("/register", authcontroller.registeruser)
router.post("/login", authcontroller.loginuser)
router.post("/logout", authcontroller.logoutuser)
router.get("/me", authmiddleware, authcontroller.getme)
module.exports = router
