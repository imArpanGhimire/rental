const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("../config/cloudinary")

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "profile-picture",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }
})

const uploadProfile = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

module.exports = uploadProfile