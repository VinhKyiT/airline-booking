var mongoose = require("mongoose");
const Airplane = require('./airplane.model');

var airplaneCompanySchema = new mongoose.Schema({
    name: String, 
    code: String
});

var AirplaneCompany = mongoose.model("AirplaneCompany", airplaneCompanySchema, "airplane_company");

module.exports = AirplaneCompany;
