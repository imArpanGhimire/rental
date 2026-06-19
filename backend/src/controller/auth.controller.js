const usermodel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const cookieOptions = {
    httpOnly: true,  //?  js cannot access this ccokie from browser
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,  // cookie expire time
}


async function registeruser(req, res) {
    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim()
        const { password, role } = req.body

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "All the fields should be filled" })
        }
        if (name.length < 3 || name.length > 20) {
            return res.status(400).json({ message: "name must be 3–20 characters" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        if (!["owner", "renter"].includes(role)) {
            return res.status(400).json({
                message: "Select either owner or renter"
            })
        }


        const alreadyExists = await usermodel.findOne({ email })
        if (alreadyExists) {
            return res.status(400).json({
                message: "user with this email already exists"
            })
        }

        // password hashing

        const hash = await bcrypt.hash(password, 10)
        const user = await usermodel.create({ name, password: hash, email, role })

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, cookieOptions)

        return res.status(201).json({
            message: "user created succesfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })
    }
    catch (e) {
        console.log(e)
        return res.status(500).json({
            message: "Internal server error"
        })
    }
}


async function loginuser(req, res) {
    try {
        const email = req.body.email?.trim()
        const { password } = req.body

        //todo email psw input check

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }


        const user = await usermodel.findOne({ email })
        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }




        // todo     password verify
        const pswcheck = await bcrypt.compare(password, user.password)
        if (!pswcheck) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            message: "Logged in successfully",
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        })

    }
    catch (e) {
        console.log(e)
        res.status(500).json({
            message: e
        })
    }
}

async function logoutuser(req, res) {
    res.clearCookie("token", cookieOptions)
    return res.status(200).json({
        message: "Logged out successfully"
    })
}

module.exports = { registeruser, loginuser, logoutuser }