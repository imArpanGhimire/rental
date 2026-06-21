const mongoose = require("mongoose")

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("db connected successfully")
    }
    catch (e) {
        console.log(e)
        process.exit(1)
    }
}
module.exports = connectDB