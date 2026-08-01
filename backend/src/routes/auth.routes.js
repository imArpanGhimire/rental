const express = require("express")
const router = express.Router()

const authcontroller = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const uploadProfile = require("../middleware/uploadProfile.middleware")

function handleProfileUpload(req, res, next) {
    uploadProfile.single("profilePicture")(req, res, function (err) {
        if (err) {
            return res.status(400).json({
                message: "Image upload failed",
                error: err.message || err
            })
        }
        next()
    })
}

router.post("/register", authcontroller.registeruser)
router.post("/login", authcontroller.loginuser)
router.post("/logout", authcontroller.logoutuser)
router.put("/update-profile-picture", authMiddleware, handleProfileUpload, authcontroller.updateprofilepicture)

module.exports = router