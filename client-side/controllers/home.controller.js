const Airport = require('../models/airport.model');
const TicketClass = require('../models/ticket_class.model');

module.exports.get = async function(req, res){
    var airports = await Airport.find();
    var ticket_classes = await TicketClass.find();

    res.render("./home/index", {
        airports,
        ticket_classes
    });
}