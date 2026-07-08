const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())


const authroutes = require("./routes/auth.routes")
const propertyroutes = require("./routes/property.routes")
const reviewroutes = require("./routes/review.routes")
const favoritesroutes = require("./routes/favorites.routes")

app.use("/api/auth", authroutes)
app.use("/api/properties", propertyroutes)
app.use("/api/reviews", reviewroutes)
app.use("/api/favorites", favoritesroutes)

module.exports = app