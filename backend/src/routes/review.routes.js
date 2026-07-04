const express = require("express")
const router = express.Router()

const reviewcontroller = require("../controller/review.controller")

router.post("/create-review/:propertyid", reviewcontroller.createreview)
router.get("/get-property-review/:propertyid", reviewcontroller.getpropertyreviews)
router.delete("/delete-review/:reviewid", reviewcontroller.deletereview)
router.post("/reply-review/:reviewid", reviewcontroller.replytoreview)
router.patch("/edit-reply/:reviewid", reviewcontroller.editreply)

module.exports = router