const jwt = require("jsonwebtoken");

function authmiddleware(req, res, next) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            message: "Unathorized access",
        });
    }
    try {
        const verifieduser = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verifieduser;
        next();
    } catch (e) {
        return res.status(401).json({
            message: "Unathorized catch",
        });
    }
}

module.exports = authmiddleware;
