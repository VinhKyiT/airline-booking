var mongoose = require("mongoose");

var airplaneSchema = new mongoose.Schema({
    airplane_company_id: String,
    name: String,
    economy_seatNum: Number,
    business_seatNum: Number,
    premium_economy_seatNum: Number,
});

var Airplane = mongoose.model("Airplane", airplaneSchema, "airplane");

module.exports = Airplane;
