const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");
const visitRequestController = require("../controller/visitRequest.controller");

router.post("/", authMiddleware, visitRequestController.createVisitRequest);
router.get("/mine", authMiddleware, visitRequestController.getMyVisitRequests);
router.get("/owner", authMiddleware, visitRequestController.getOwnerVisitRequests);
router.put("/:id/status", authMiddleware, visitRequestController.updateVisitRequestStatus);

module.exports = router;
