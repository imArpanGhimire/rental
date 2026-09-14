const express =
    require("express");

const {
    body,
} = require("express-validator");

const authMiddleware =
    require("../middleware/auth.middleware");

const {
    sendSupportReport,
} = require("../controller/support.controller");

const router =
    express.Router();

/* =========================================================
   VALIDATION
========================================================= */

const supportValidation = [
    body("issueType")
        .isIn([
            "bug",
            "technical",
            "feedback",
            "account",
            "listing",
            "other",
        ])
        .withMessage(
            "Please select a valid issue type."
        ),

    body("subject")
        .trim()
        .isLength({
            min: 3,
            max: 120,
        })
        .withMessage(
            "Subject must be between 3 and 120 characters."
        ),

    body("description")
        .trim()
        .isLength({
            min: 10,
            max: 5000,
        })
        .withMessage(
            "Description must be between 10 and 5000 characters."
        ),

    body("affectedPage")
        .optional({
            checkFalsy: true,
        })
        .trim()
        .isLength({
            max: 300,
        })
        .withMessage(
            "Affected page is too long."
        ),

    body("browserInfo")
        .optional({
            checkFalsy: true,
        })
        .trim()
        .isLength({
            max: 1000,
        })
        .withMessage(
            "Browser information is too long."
        ),
];

/* =========================================================
   ROUTES
========================================================= */

router.post(
    "/report",
    authMiddleware,
    supportValidation,
    sendSupportReport
);

module.exports = router;