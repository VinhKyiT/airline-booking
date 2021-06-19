var mongoose = require("mongoose");

var ticketClassSchema = new mongoose.Schema({
    name: String,
    multiply: Number
});

var TicketClass = mongoose.model("TicketClass", ticketClassSchema, "ticket_class");

module.exports = TicketClass;
