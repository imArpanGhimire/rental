const express = require("express")
const router = express.Router()

const reviewcontroller = require("../controller/review.controller")

router.post("/create-review/:propertyid", authMiddleware, reviewcontroller.createreview)
router.get("/get-property-review/:propertyid", reviewcontroller.getpropertyreviews) // public is fine, anyone can read reviews
router.delete("/delete-review/:reviewid", authMiddleware, reviewcontroller.deletereview)
router.post("/reply-review/:reviewid", authMiddleware, reviewcontroller.replytoreview)
router.patch("/edit-reply/:reviewid", authMiddleware, reviewcontroller.editreply)

module.exports = router