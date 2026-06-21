const express = require("express")
const app = express()
const cookieParser = require("cookie-parser")

app.use(express.json())
app.use(cookieParser())


const authroutes = require("./routes/auth.routes")
const propertyroutes = require("./routes/property.routes")


app.use("/api/auth", authroutes)
app.use("/api/properties", propertyroutes)


module.exports = app