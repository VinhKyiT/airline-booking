var mongoose = require("mongoose");

var billDetailSchema = new mongoose.Schema({
    bill_id: {
        type: String,
        ref: "Bill",
    },
    ticket_id: {
        type: String,
        ref: "Ticket"
    },
});

var BillDetail = mongoose.model("BillDetail", billDetailSchema, "bill_detail");

module.exports = BillDetail;
