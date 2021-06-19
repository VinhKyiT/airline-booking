var mongoose = require("mongoose");

var cancelSchema = new mongoose.Schema({
    customer_id: {
        type: String, 
        ref: "Customer"
    },
    ticket_id: {
        type: String, 
        ref: "Ticket"
    },
    date: {
        type: Date,
        default: new Date()
    },
    status: {
        type: String,
        default: "Chưa xử lý"
    }
});

cancelSchema.virtual("date_create").get(function () {
    var m = this.date.getMonth() + 1;
    var d = this.date.getDate();
    var y = this.date.getFullYear();
    return d + "/" + m + "/" + y;
});

var Cancel = mongoose.model("Cancel", cancelSchema, "cancel");

module.exports = Cancel;
