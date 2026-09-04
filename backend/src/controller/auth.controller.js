const usermodel = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { validationResult } = require("express-validator")
const cloudinary = require("../config/cloudinary")
const SECURITY_QUESTIONS = require("../config/securityQuestions")

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

// answers are normalized before hashing/comparing so casing and
// stray whitespace ("Rex", "rex ", "REX") all count as the same answer
function normalizeAnswer(answer) {
    return (answer || "").trim().toLowerCase()
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
        const { password, role, securityAnswers } = req.body

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

        if (!Array.isArray(securityAnswers) || securityAnswers.length !== 2) {
            return res.status(400).json({
                message: "Please answer exactly two security questions"
            })
        }

        const [first, second] = securityAnswers

        if (
            !SECURITY_QUESTIONS.includes(first?.question) ||
            !SECURITY_QUESTIONS.includes(second?.question)
        ) {
            return res.status(400).json({
                message: "Invalid security question"
            })
        }

        if (first.question === second.question) {
            return res.status(400).json({
                message: "Please choose two different security questions"
            })
        }

        if (!normalizeAnswer(first.answer) || !normalizeAnswer(second.answer)) {
            return res.status(400).json({
                message: "Security answers cannot be empty"
            })
        }

        const alreadyExists = await usermodel.findOne({ email })

        if (alreadyExists) {
            return res.status(400).json({
                message: "user with this email already exists"
            })
        }

        const hash = await bcrypt.hash(password, 10)

        const hashedSecurityQuestions = await Promise.all(
            securityAnswers.map(async (item) => ({
                question: item.question,
                answerHash: await bcrypt.hash(normalizeAnswer(item.answer), 10)
            }))
        )

        const user = await usermodel.create({
            name,
            password: hash,
            email,
            role,
            phone,
            securityQuestions: hashedSecurityQuestions
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

        // validateModifiedOnly: only re-check the fields actually changed
        // in this save (here, just "name") instead of the whole document —
        // otherwise accounts created before securityQuestions existed fail
        // validation on every unrelated update because that field is empty
        await user.save({ validateModifiedOnly: true })

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

        await user.save({ validateModifiedOnly: true })

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

        await user.save({ validateModifiedOnly: true })

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

        await user.save({ validateModifiedOnly: true })

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

function getsecurityquestionslist(req, res) {
    return res.status(200).json({
        questions: SECURITY_QUESTIONS
    })
}

async function getaccountsecurityquestions(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const email = req.body.email?.trim().toLowerCase()

        const user = await usermodel.findOne({ email })

        if (!user || !user.securityQuestions || user.securityQuestions.length !== 2) {
            return res.status(404).json({
                message: "No account found with that email"
            })
        }

        return res.status(200).json({
            questions: user.securityQuestions.map((q) => q.question)
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function verifysecurityanswers(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const email = req.body.email?.trim().toLowerCase()
        const { answers } = req.body

        const user = await usermodel.findOne({ email })

        if (!user || !user.securityQuestions || user.securityQuestions.length !== 2) {
            return res.status(404).json({
                message: "No account found with that email"
            })
        }

        for (const stored of user.securityQuestions) {
            const submitted = answers.find((a) => a.question === stored.question)

            if (!submitted) {
                return res.status(400).json({
                    message: "One or more answers are incorrect"
                })
            }

            const match = await bcrypt.compare(
                normalizeAnswer(submitted.answer),
                stored.answerHash
            )

            if (!match) {
                return res.status(400).json({
                    message: "One or more answers are incorrect"
                })
            }
        }

        // short-lived token scoped only to resetting the password —
        // it's not the login/session token and can't be used to access
        // anything else, and it expires in 10 minutes
        const resetToken = jwt.sign(
            {
                id: user._id,
                purpose: "password_reset"
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "10m"
            }
        )

        return res.status(200).json({
            resetToken
        })
    }
    catch (e) {
        console.error(e)

        return res.status(500).json({
            message: "Internal server error"
        })
    }
}

async function resetpasswordwithtoken(req, res) {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        })
    }

    try {
        const { resetToken, newPassword } = req.body

        let payload

        try {
            payload = jwt.verify(resetToken, process.env.JWT_SECRET)
        }
        catch (e) {
            return res.status(400).json({
                message: "Reset session expired, please start again"
            })
        }

        if (payload.purpose !== "password_reset") {
            return res.status(400).json({
                message: "Invalid reset request"
            })
        }

        const user = await usermodel.findById(payload.id)

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        user.password = await bcrypt.hash(newPassword, 10)

        await user.save({ validateModifiedOnly: true })

        return res.status(200).json({
            message: "Password reset successfully"
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
    removeprofilepicture,
    getsecurityquestionslist,
    getaccountsecurityquestions,
    verifysecurityanswers,
    resetpasswordwithtoken
}