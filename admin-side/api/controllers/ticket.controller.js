const Route = require('../../models/route.model');
const Ticket = require('../../models/ticket.model');
const TicketClass = require('../../models/ticket_class.model');

module.exports.getTicketByRouteID = async function(req, res){
    const {routeID, ticket_class_id} = req.params;

    var route = await Route.findById(routeID);
    var ticket_class = await TicketClass.findById(ticket_class_id);

    var tickets = await Ticket.find({
        route_id: routeID,
        ticket_class_id
    })

    tickets.forEach((item) => {
        item.route = route.code;
        item.ticket_class = ticket_class.name
        item.price_multiply = item.price * ticket_class.multiply
    });

    res.json(tickets);
}

module.exports.getTicketByCode = async function(req, res){
    const {routeID, ticket_class_id, code} = req.params;

    var route = await Route.findById(routeID);
    var ticket_class = await TicketClass.findById(ticket_class_id);

    var tickets = await Ticket.find({
        route_id: routeID,
        ticket_class_id,
        code: {$regex: code}
    })

    tickets.forEach((item) => {
        item.route = route.code;
        item.ticket_class = ticket_class.name
        item.price_multiply = item.price * ticket_class.multiply;
    });

    res.json(tickets);
}