const express = require("express")
const router = express.Router()

const { body } = require("express-validator")

const authcontroller = require("../controller/auth.controller")
const authMiddleware = require("../middleware/auth.middleware")
const uploadProfile = require("../middleware/uploadProfile.middleware")

function handleProfileUpload(req, res, next) {
    uploadProfile.single("profilePicture")(
        req,
        res,
        function (err) {
            if (err) {
                return res.status(400).json({
                    message: "Image upload failed",
                    error: err.message || err
                })
            }

            next()
        }
    )
}

const registerValidation = [
    body("name")
        .trim()
        .isLength({
            min: 2,
            max: 20
        })
        .withMessage("name must be 2–20 characters"),

    body("email")
        .isEmail()
        .withMessage("valid email required"),

    body("password")
        .isLength({
            min: 6
        })
        .withMessage("password must be at least 6 characters"),

    body("role")
        .isIn(["owner", "renter"])
        .withMessage("role must be owner or renter"),

    body("phone")
        .matches(/^9[678]\d{8}$/)
        .withMessage(
            "Enter a valid 10-digit Nepali mobile number"
        )
]

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage("valid email required"),

    body("password")
        .notEmpty()
        .withMessage("password is required")
]

router.post(
    "/register",
    registerValidation,
    authcontroller.registeruser
)

router.post(
    "/login",
    loginValidation,
    authcontroller.loginuser
)

router.post(
    "/logout",
    authcontroller.logoutuser
)

router.get(
    "/me",
    authMiddleware,
    authcontroller.getme
)

router.put(
    "/update-profile-picture",
    authMiddleware,
    handleProfileUpload,
    authcontroller.updateprofilepicture
)

module.exports = router