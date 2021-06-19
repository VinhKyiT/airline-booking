var mongoose = require("mongoose");

var billSchema = new mongoose.Schema({
    customer_id: String,
    date: {
        type: Date,
        default: new Date()
    },
    total_payment: Number,
    code: String
});

billSchema.virtual("date_create").get(function () {
    var m = this.date.getMonth() + 1;
    var d = this.date.getDate();
    var y = this.date.getFullYear();
    return d + "/" + m + "/" + y;
});

var Bill = mongoose.model("Bill", billSchema, "bill");

module.exports = Bill;
