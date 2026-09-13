const express = require("express")
const router = express.Router()

const {
    body
} = require("express-validator")

const authcontroller =
    require("../controller/auth.controller")

const authMiddleware =
    require("../middleware/auth.middleware")

const uploadProfile =
    require("../middleware/uploadProfile.middleware")

const SECURITY_QUESTIONS =
    require("../config/securityQuestions")

function handleProfileUpload(
    req,
    res,
    next
) {
    uploadProfile.single(
        "profilePicture"
    )(
        req,
        res,
        function (err) {
            if (err) {
                return res
                    .status(400)
                    .json({
                        message:
                            "Image upload failed",

                        error:
                            err.message ||
                            err
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
        .withMessage(
            "Name must be 2-20 characters"
        ),

    body("email")
        .isEmail()
        .withMessage(
            "Valid email required"
        ),

    body("password")
        .isLength({
            min: 6
        })
        .withMessage(
            "Password must be at least 6 characters"
        ),

    body("role")
        .isIn([
            "owner",
            "renter"
        ])
        .withMessage(
            "Role must be owner or renter"
        ),

    /*
     * Owner:
     * phone is mandatory.
     *
     * Renter:
     * phone is optional, but if entered
     * it still must be valid.
     */
    body("phone").custom(
        (phone, { req }) => {
            const value =
                String(
                    phone || ""
                ).trim()

            if (
                req.body.role ===
                "owner" &&
                !value
            ) {
                throw new Error(
                    "Phone number is required for property owners"
                )
            }

            if (
                value &&
                !/^9[678]\d{8}$/.test(
                    value
                )
            ) {
                throw new Error(
                    "Enter a valid 10-digit Nepali mobile number"
                )
            }

            return true
        }
    ),

    body("securityAnswers")
        .isArray({
            min: 2,
            max: 2
        })
        .withMessage(
            "Please answer exactly two security questions"
        ),

    body(
        "securityAnswers.*.question"
    )
        .isIn(SECURITY_QUESTIONS)
        .withMessage(
            "Invalid security question"
        ),

    body(
        "securityAnswers.*.answer"
    )
        .trim()
        .isLength({
            min: 1
        })
        .withMessage(
            "Security answers cannot be empty"
        ),

    body(
        "securityAnswers"
    ).custom((arr) => {
        if (
            Array.isArray(arr) &&
            arr.length === 2 &&
            arr[0]?.question ===
            arr[1]?.question
        ) {
            throw new Error(
                "Please choose two different security questions"
            )
        }

        return true
    })
]

const loginValidation = [
    body("email")
        .isEmail()
        .withMessage(
            "Valid email required"
        ),

    body("password")
        .notEmpty()
        .withMessage(
            "Password is required"
        )
]

const updateProfileValidation = [
    body("name")
        .trim()
        .isLength({
            min: 2,
            max: 20
        })
        .withMessage(
            "Name must be 2-20 characters"
        )
]

const passwordValidation = [
    body("currentPassword")
        .notEmpty()
        .withMessage(
            "Current password is required"
        ),

    body("newPassword")
        .isLength({
            min: 6
        })
        .withMessage(
            "New password must be at least 6 characters"
        )
]

const forgotPasswordQuestionsValidation =
    [
        body("email")
            .isEmail()
            .withMessage(
                "Valid email required"
            )
    ]

const forgotPasswordVerifyValidation =
    [
        body("email")
            .isEmail()
            .withMessage(
                "Valid email required"
            ),

        body("answers")
            .isArray({
                min: 2,
                max: 2
            })
            .withMessage(
                "Both answers are required"
            ),

        body(
            "answers.*.question"
        )
            .isString()
            .trim()
            .notEmpty()
            .withMessage(
                "Security question is required"
            )
            .custom(
                (question) => {
                    if (
                        !SECURITY_QUESTIONS.includes(
                            question
                        )
                    ) {
                        throw new Error(
                            "Invalid security question"
                        )
                    }

                    return true
                }
            ),

        body("answers.*.answer")
            .isString()
            .trim()
            .notEmpty()
            .withMessage(
                "Security answer is required"
            ),

        body("answers").custom(
            (answers) => {
                if (
                    !Array.isArray(
                        answers
                    ) ||
                    answers.length !==
                    2
                ) {
                    return true
                }

                if (
                    answers[0]
                        ?.question ===
                    answers[1]
                        ?.question
                ) {
                    throw new Error(
                        "Security questions must be different"
                    )
                }

                return true
            }
        )
    ]

const forgotPasswordResetValidation =
    [
        body("resetToken")
            .notEmpty()
            .withMessage(
                "Reset token is required"
            ),

        body("newPassword")
            .isLength({
                min: 6
            })
            .withMessage(
                "New password must be at least 6 characters"
            )
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

router.patch(
    "/me",
    authMiddleware,
    updateProfileValidation,
    authcontroller.updateprofile
)

router.patch(
    "/me/password",
    authMiddleware,
    passwordValidation,
    authcontroller.updatepassword
)

router.put(
    "/update-profile-picture",
    authMiddleware,
    handleProfileUpload,
    authcontroller.updateprofilepicture
)

router.delete(
    "/remove-profile-picture",
    authMiddleware,
    authcontroller.removeprofilepicture
)

router.get(
    "/security-questions-list",
    authcontroller.getsecurityquestionslist
)

router.post(
    "/forgot-password/questions",
    forgotPasswordQuestionsValidation,
    authcontroller.getaccountsecurityquestions
)

router.post(
    "/forgot-password/verify",
    forgotPasswordVerifyValidation,
    authcontroller.verifysecurityanswers
)

router.post(
    "/forgot-password/reset",
    forgotPasswordResetValidation,
    authcontroller.resetpasswordwithtoken
)

module.exports = router