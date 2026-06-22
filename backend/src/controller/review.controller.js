const rentalmodel = require("../model/rental.model")
const reviewmodel = require("../model/review.model")

async function createreview() {
    // const {id}=req.query
    const { rating, comment } = req.body
    const propertyid = req.params.propertyid
    //    const reviewerid=req.user._id

    try {

    }
    catch (e) {
        console.error(e)
        return res.status(500).json({
            message: "internal sever error"
        })
    }
}