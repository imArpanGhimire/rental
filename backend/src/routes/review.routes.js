const express = require("express")
const router = express.Router()

// controller 
const reviewcontroller = require("../controller/review.controller")


router.post("/create-review", reviewcontroller.createreview)
router.get("/get-property-review", reviewcontroller.getpropertyreviews)
router.delete("/delete-review", reviewcontroller.deletereview)
router.post("/reply-review", reviewcontroller.replytoreview)
router.patch("/edit-review", reviewcontroller.editreply)

module.exports = router