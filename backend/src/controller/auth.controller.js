const usermodel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const cloudinary = require("../config/cloudinary")

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

async function updateprofile(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const name = req.body.name?.trim()

        if (!name) {
            return res.status(400).json({
                message: "Name is required"
            })
        }

        if (name.length < 2 || name.length > 20) {
            return res.status(400).json({
                message: "name must be 2–20 characters"
            })
        }

        const user = await usermodel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.name = name

        await user.save()

        return res.status(200).json({
            message: "Profile updated",
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

async function updatepassword(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const { currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.status(400).json({
                message: "Current and new password are required"
            })
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            })
        }

        const user = await usermodel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const pswcheck = await bcrypt.compare(currentPassword, user.password)

        if (!pswcheck) {
            // IMPORTANT: this must NOT be 401. The axios client's
            // response interceptor treats any 401 as "session expired"
            // and force-logs-out + redirects to /login. A wrong current
            // password is a validation failure, not an auth failure —
            // use 400 so it stays on the settings page as a normal error.
            return res.status(400).json({
                message: "Current password is incorrect"
            })
        }

        const samePassword = await bcrypt.compare(newPassword, user.password)

        if (samePassword) {
            return res.status(400).json({
                message: "New password must be different from current password"
            })
        }

        user.password = await bcrypt.hash(newPassword, 10)

        await user.save()

        return res.status(200).json({
            message: "Password updated successfully"
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

        const oldPublicId = user.profilePicturePublicId

        user.profilePicture = req.file.path
        user.profilePicturePublicId = req.file.filename

        await user.save()

        if (oldPublicId) {
            cloudinary.uploader.destroy(oldPublicId, (err) => {
                if (err) console.error("Couldn't delete old Cloudinary image:", err.message)
            })
        }

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

async function removeprofilepicture(req, res) {
    try {
        const user = await usermodel.findById(req.user.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        const publicId = user.profilePicturePublicId

        user.profilePicture = ""
        user.profilePicturePublicId = ""

        await user.save()

        if (publicId) {
            cloudinary.uploader.destroy(publicId, (err) => {
                if (err) console.error("Couldn't delete Cloudinary image:", err.message)
            })
        }

        return res.status(200).json({
            message: "Profile picture removed",
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
    updateprofile,
    updatepassword,
    updateprofilepicture,
    removeprofilepicture
}