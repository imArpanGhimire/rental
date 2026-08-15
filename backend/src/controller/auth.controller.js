const usermodel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

async function registeruser(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const name = req.body.name?.trim()
        const email = req.body.email?.trim().toLowerCase()
        const phone = req.body.phone?.trim()
        const { password, role } = req.body

        if (!name || !email || !password || !role || !phone) {
            return res.status(400).json({
                message: "All the fields should be filled"
            })
        }

        if (!/^9[678]\d{8}$/.test(phone)) {
            return res.status(400).json({
                message: "Enter a valid 10-digit Nepali mobile number"
            })
        }

        if (name.length < 2 || name.length > 20) {
            return res.status(400).json({
                message: "name must be 2–20 characters"
            })
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            })
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

        const hash = await bcrypt.hash(password, 10)

        const user = await usermodel.create({
            name,
            password: hash,
            email,
            role,
            phone
        })

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions)

        return res.status(201).json({
            message: "user created succesfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profilePicture: user.profilePicture
            }
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function loginuser(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const email = req.body.email?.trim().toLowerCase()
        const { password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required"
            })
        }

        const user = await usermodel.findOne({ email })

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const pswcheck = await bcrypt.compare(
            password,
            user.password
        )

        if (!pswcheck) {
            return res.status(401).json({
                message: "Invalid credentials"
            })
        }

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        )

        res.cookie("token", token, cookieOptions)

        return res.status(200).json({
            message: "Logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profilePicture: user.profilePicture
            }
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function logoutuser(req, res) {
    res.clearCookie("token", cookieOptions)

    return res.status(200).json({
        message: "Logged out successfully"
    })
}

async function getme(req, res) {
    try {
        const user = await usermodel
            .findById(req.user.id)
            .select("-password")

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profilePicture: user.profilePicture
            }
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function updateprofilepicture(req, res) {
    if (!req.file) {
        return res.status(400).json({
            message: "No image uploaded"
        })
    }

    try {
        const user = await usermodel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.profilePicture = req.file.path

        await user.save()

        return res.status(200).json({
            message: "Profile picture updated",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                profilePicture: user.profilePicture
            }
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

module.exports = {
    registeruser,
    loginuser,
    logoutuser,
    getme,
    updateprofilepicture
}