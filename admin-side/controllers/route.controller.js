const Route = require("../models/route.model");
const RouteDetail = require("../models/route_detail.model");
const Airport = require("../models/airport.model");
const Airplane = require("../models/airplane.model");
const Status = require('../models/status.model');
const _ = require("lodash");
const shortid = require('short-id');
const Ticket = require("../models/ticket.model");
const TicketClass = require("../models/ticket_class.model");

module.exports.get = async function (req, res) {
    var routes = await Route.find().populate("status_id");
    var airports = await Airport.find();
    var airplanes = await Airplane.find();

    for (let i = 0; i < routes.length; i++) {
        var depart_airport = await Airport.findById(routes[i].depart_airport_id)
        var arrival_airport = await Airport.findById(routes[i].arrival_airport_id)
        routes[i].depart_airport = depart_airport.name;
        routes[i].arrival_airport = arrival_airport.name;
    }

    res.render("./route/index", {
        routes,
        airports,
        airplanes,
    });
};

module.exports.postCreate = async function (req, res) {
    req.body.code = shortid.generate().toUpperCase();
    var route = await Route.create(req.body);
    var status = await Status.findOne({ name: "normal" });
    var airplane = await Airplane.findById(req.body.airplane_id);
    var economy_class = await TicketClass.findOne({ name: "Hạng phổ thông" });
    var premium_class = await TicketClass.findOne({
        name: "Hạng phổ thông đặc biệt",
    });
    var business_class = await TicketClass.findOne({ name: "Hạng thương gia" });
    req.body.route_id = route._id;
    req.body.status_id = status._id;

    RouteDetail.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    //Thêm vé hạng phổ thông
    for (let i = 0; i < airplane.economy_seatNum; i++) {
        var code = `ECO0${i}`
        if (i >= 10){
            code = `ECO${i}`;
        }
        var economy_ticket = new Ticket({
            route_id: req.body.route_id,
            ticket_class_id: economy_class._id,
            price: req.body.price * economy_class.multiply,
            code: code,
            status: "Vẫn còn",
        });
        Ticket.create(economy_ticket);
    }

    //Thêm vé hạng phổ thông đặc biệt
    for (let i = 0; i < airplane.premium_economy_seatNum; i++) {
        var code = `PRE0${i}`;
        if (i >= 10){
            code = `PRE${i}`;
        }
        var premium_ticket = new Ticket({
            route_id: req.body.route_id,
            ticket_class_id: premium_class._id,
            price: req.body.price * premium_class.multiply,
            code: code,
            status: "Vẫn còn",
        });
        Ticket.create(premium_ticket);
    }

    //Thêm vé hạng thương gia
    for (let i = 0; i < airplane.business_seatNum; i++) {
        var code = `BUS0${i}`;
        if (i >= 10){
            code = `BUS${i}`
        }
        var business_ticket = new Ticket({
            route_id: req.body.route_id,
            ticket_class_id: business_class._id,
            price: req.body.price * business_class.multiply,
            code: code,
            status: "Vẫn còn",
        });
        Ticket.create(business_ticket);
    }

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    const {routeID} = req.params
    var airports = await Airport.find();
    var airplanes = await Airplane.find();

    var status = await Status.find();

    var route = await Route.findById(routeID);
    var route_detail = await RouteDetail.find({route_id: routeID})
    var rDetail = [];

    var economy_class = await TicketClass.findOne({ name: "Hạng phổ thông" });
    var premium_class = await TicketClass.findOne({name: "Hạng phổ thông đặc biệt"});
    var business_class = await TicketClass.findOne({ name: "Hạng thương gia" });

    var economy_ticket = await Ticket.find({route_id: routeID, ticket_class_id: economy_class._id})
    var premium_ticket = await Ticket.find({route_id: routeID, ticket_class_id: premium_class._id})
    var business_ticket = await Ticket.find({route_id: routeID, ticket_class_id: business_class._id})

    var depart = await Airport.findById(route.depart_airport_id);
    var arrival = await Airport.findById(route.arrival_airport_id);

    var id = depart._id

    for (let i = 0; i < route_detail.length; i++) {
        var rd = await RouteDetail.findOne({ route_id: routeID, depart_airport_id: id}, (err, docs) => {
            if (err){
                res.render("./route/edit", {
                    route,
                    rDetail,
                    airports,
                    airplanes,
                    economy_ticket,
                    premium_ticket,
                    business_ticket,
                    status,
                    error: "Bạn không thể thêm cùng chuyến bay"
                });
                return;
            }
        });
        var a = await Airport.findById(rd.arrival_airport_id);
        var d = await Airport.findById(rd.depart_airport_id);
        var plane = await Airplane.findById(rd.airplane_id);

        rd.depart_airport = d.name;
        rd.arrival_airport = a.name;
        rd.plane = plane.name;
        rDetail.push(rd)
        id = a._id
    }

    res.render("./route/edit", {
        route,
        rDetail,
        airports,
        airplanes,
        economy_ticket,
        premium_ticket,
        business_ticket,
        status,
    });
};

module.exports.postEdit = async function (req, res) {
    var route = await Route.findById(req.params.routeID);

    _.extend(route, req.body);
    route.save();

    res.redirect("back");
};

module.exports.delete = async function (req, res) {
    Route.findByIdAndDelete(req.params.routeID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    var tickets = await Ticket.find({ route_id: req.params.routeID });

    var routeDetail = await RouteDetail.find({route_id: req.params.routeID});

    for (let i = 0; i < routeDetail.length; i++) {
        await RouteDetail.findByIdAndDelete(routeDetail[i]._id)
    }

    for (let i = 0; i < tickets.length; i++) {
        await Ticket.findByIdAndDelete(tickets[i]._id);
    }

    res.redirect("back");
};

module.exports.addStation = async function(req, res){
    const {routeID} = req.params;
    var status = await Status.findOne({ name: "normal" });
    var route_detail = await RouteDetail.find({ route_id: routeID }).sort({
        _id: -1,
    });

    var length = route_detail.length;

    var obj = {
        depart_airport_id: route_detail[length - 1].depart_airport_id,
        arrival_airport_id: req.body.new_airport,
        airplane_id: req.body.airplane_id,
        route_id: routeID,
        status_id: status._id,
    };

    await RouteDetail.create(obj);

    _.extend(route_detail[length - 1], {
        depart_airport_id: req.body.new_airport
    });

    route_detail.forEach(item => {
        item.save();
    });

    res.redirect('back')
}
