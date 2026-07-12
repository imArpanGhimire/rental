const express = require("express")
const router = express.Router()

const reviewcontroller = require("../controller/review.controller")
const authMiddleware = require("../middleware/auth.middleware")

router.post("/create-review/:propertyid", authMiddleware, reviewcontroller.createreview)
router.get("/get-property-review/:propertyid", reviewcontroller.getpropertyreviews)
router.delete("/delete-review/:reviewid", authMiddleware, reviewcontroller.deletereview)
router.post("/reply-review/:reviewid", authMiddleware, reviewcontroller.replytoreview)
router.patch("/edit-reply/:reviewid", authMiddleware, reviewcontroller.editreply)

module.exports = router