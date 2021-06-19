const Route = require('../models/route.model');
const Ticket = require('../models/ticket.model');
const TicketClass = require('../models/ticket_class.model');

module.exports.get = async function(req, res){
    var routes = await Route.find();
    var ticket_classes = await TicketClass.find();

    res.render("./ticket/index", {
        routes,
        ticket_classes
    });
}

module.exports.changeStatus = async function (req, res) {
    const {ticketID} = req.params;

    var ticket = await Ticket.findById(ticketID);
    switch (ticket.status){
        case "Vẫn còn":
            ticket.status = "Đã đặt"
            break;
        case "Đã đặt": 
            ticket.status = "Vẫn còn";
            break;
        default:
            break;
    }

    ticket.save();

    res.redirect('back')
};

