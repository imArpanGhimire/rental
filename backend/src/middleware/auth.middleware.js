const jwt = require("jsonwebtoken")

function authmiddleware(req, res, next) {
    try {
        const token = req.body.token

        if (!token) {
            return res.status(401).json({
                message: "Unathorized access"
            })
        }

        const verifieduser = jwt.verify(token, process.env.JWT_SECRET)
        req.user = verifieduser



    }
    catch (e) {
        return res.status(401).json({
            message: "Unathorized catch"
        })
    }
}


module.exports = authmiddleware