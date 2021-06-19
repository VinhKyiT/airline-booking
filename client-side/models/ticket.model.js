var mongoose = require("mongoose");

var ticketSchema = new mongoose.Schema({
    route_id: String,
    ticket_class_id: {
        type: String,
        ref: 'TicketClass'
    },
    price: Number,
    price_multiply: Number,
    status: String,
    code: String,
    route: String,
    ticket_class: String,
});

var Ticket = mongoose.model("Ticket", ticketSchema, "ticket");

module.exports = Ticket;
