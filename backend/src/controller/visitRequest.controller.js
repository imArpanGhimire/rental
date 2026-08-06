const visitRequestModel = require("../model/visitRequest.model");
const rentalModel = require("../model/rental.model");

async function createVisitRequest(req, res) {
  try {
    if (req.user.role !== "renter") {
      return res.status(403).json({ message: "Only renters can send visit requests" });
    }

    const { propertyId, message } = req.body;
    if (!propertyId) {
      return res.status(400).json({ message: "propertyId is required" });
    }

    const property = await rentalModel.findById(propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const existing = await visitRequestModel.findOne({
      property: propertyId,
      renter: req.user.id,
      status: "pending",
    });
    if (existing) {
      return res.status(400).json({ message: "You already have a pending request for this property" });
    }

    const visitRequest = await visitRequestModel.create({
      property: propertyId,
      renter: req.user.id,
      owner: property.owner,
      message: message?.trim() || "",
    });

    return res.status(201).json({
      message: "Visit request sent",
      visitRequest,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getMyVisitRequests(req, res) {
  try {
    const requests = await visitRequestModel
      .find({ renter: req.user.id })
      .populate("property", "title images price location")
      .populate("owner", "name phone")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function getOwnerVisitRequests(req, res) {
  try {
    const requests = await visitRequestModel
      .find({ owner: req.user.id })
      .populate("property", "title images price location")
      .populate("renter", "name phone email")
      .sort({ createdAt: -1 });

    return res.status(200).json({ requests });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

async function updateVisitRequestStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!["accepted", "declined"].includes(status)) {
      return res.status(400).json({ message: "status must be accepted or declined" });
    }

    const visitRequest = await visitRequestModel.findById(id);
    if (!visitRequest) {
      return res.status(404).json({ message: "Visit request not found" });
    }
    if (visitRequest.owner.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to update this request" });
    }

    visitRequest.status = status;
    await visitRequest.save();

    return res.status(200).json({ message: "Visit request updated", visitRequest });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal server error" });
  }
}

module.exports = {
  createVisitRequest,
  getMyVisitRequests,
  getOwnerVisitRequests,
  updateVisitRequestStatus,
};
