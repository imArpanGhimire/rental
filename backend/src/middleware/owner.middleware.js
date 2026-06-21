const usermodel = require("../model/user.model")

async function checkOwnership(req, res, next) {

    const user = await usermodel.findById(req.user.id)
    if (!user || user.role !== "owner") {
        return res.status(403).json({
            message: "Owners only"
        })
    }
    next()

}
module.exports = checkOwnership


