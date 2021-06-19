const Route = require('../models/route.model');
const Airport = require('../models/airport.model');
const RouteDetail = require('../models/route_detail.model');
const Airplane = require('../models/airplane.model')
const Ticket = require('../models/ticket.model');
const TicketClass = require('../models/ticket_class.model')
const Customer = require('../models/customer.model');
const Bill = require('../models/bill.model')
const BillDetail = require('../models/bill_detail.model')
const Status = require('../models/status.model')
var paypal = require("paypal-rest-sdk");
var shortId = require('short-id')

module.exports.get = async function (req, res) {
    var status = await Status.findOne({name: 'normal'})
    var routes = await Route.find({status_id: status._id});

    for (let i = 0; i < routes.length; i++) {
        var depart_airport = await Airport.findById(routes[i].depart_airport_id)
        var arrival_airport = await Airport.findById(routes[i].arrival_airport_id)

        routes[i].depart_airport = depart_airport.code;
        routes[i].arrival_airport = arrival_airport.code;
    }

    var link = "/flights/booking/one-way"

    res.render("./flight/index", {
        routes,
        link,
    });
};

module.exports.search = async function(req, res){
    var { type_route, depart_airport_id, arrival_airport_id, depart_time, arrival_time } = req.query;
    var status = await Status.findOne({ name: "normal" });
    var routes = await Route.find({
        depart_airport_id,
        arrival_airport_id,
        depart_time: { $gte: depart_time },
        status_id: status._id
    });

    if (type_route === "one-way"){
        var link = "/flights/booking/one-way";
        for (let i = 0; i < routes.length; i++) {
            var depart_airport = await Airport.findById(
                routes[i].depart_airport_id
            );
            var arrival_airport = await Airport.findById(
                routes[i].arrival_airport_id
            );

            routes[i].depart_airport = depart_airport.code;
            routes[i].arrival_airport = arrival_airport.code;
        }
    }else{
        var link = "/flights/booking/round-trip";
        var route2 = await Route.findOne({
            depart_airport_id: arrival_airport_id,
            arrival_airport_id: depart_airport_id,
            depart_time: { $gte: arrival_time },
        });

        if (!route2){
            routes = null
        }else{
            for (let i = 0; i < routes.length; i++) {
                var depart_airport = await Airport.findById(
                    routes[i].depart_airport_id
                );
                var arrival_airport = await Airport.findById(
                    routes[i].arrival_airport_id
                );

                routes[i].round_trip = route2;

                routes[i].depart_airport = depart_airport.code;
                routes[i].arrival_airport = arrival_airport.code;
            }
        }
    }

    res.render("./flight/index", {
        routes,
        link,
        type_route,
    });
}

module.exports.oneWay = async function(req, res){
    var {route_id} = req.query;
    var route = await Route.findById(route_id)
        .populate("depart_airport_id")
        .populate("arrival_airport_id");

    var eco_class = await TicketClass.findOne({name: "Hạng phổ thông"})
    var pre_class = await TicketClass.findOne({name: "Hạng phổ thông đặc biệt"})
    var bus_class = await TicketClass.findOne({name: "Hạng thương gia"})

    var route_detail = await RouteDetail.find({ route_id })
        .populate("airplane_id")
        .populate("depart_airport_id")
        .populate("arrival_airport_id")
        .sort({_id: -1});
    
    var economy_ticket = await Ticket.find({route_id: route_id, ticket_class_id: eco_class._id})
    var premium_ticket = await Ticket.find({route_id: route_id, ticket_class_id: pre_class._id});
    var business_ticket = await Ticket.find({route_id: route_id, ticket_class_id: bus_class._id});

    res.render("./flight/booking-oneway", {
        route,
        route_detail,
        economy_ticket,
        premium_ticket,
        business_ticket
    });
}

module.exports.getBookingOneWay = async function(req, res){
    if (!req.query.ticket_id){
        req.flash("danger", "Bạn chưa chọn vé");
        res.redirect(`back`);
        return;
    }else{
        res.locals.flash = undefined;
    }

    var ticket;
    var tickets = []

    var route = await Route.findById(req.params.routeID)
        .populate("depart_airport_id")
        .populate("arrival_airport_id");

    var eco = {
        count: 0,
        price: 0
    };
    var pre = {
        count: 0,
        price: 0
    };
    var bus = {
        count: 0,
        price: 0
    };
    //select 1 ticket
    if (typeof req.query.ticket_id !== 'object'){
        ticket = await Ticket.findById(req.query.ticket_id).populate('ticket_class_id');
        switch (ticket.ticket_class_id.name) {
            case "Hạng phổ thông":
                eco.count += 1;
                eco.price = ticket.price;
                break;
            case "Hạng phổ thông đặc biệt":
                pre.count += 1;
                pre.price = ticket.price;
                break;
            case "Hạng thương gia":
                bus.count += 1;
                bus.price = ticket.price;
                break;
            default:
                break;
        }
    }else{
        for (let i = 0; i < req.query.ticket_id.length; i++) {
            var ticket = await Ticket.findById(req.query.ticket_id[i]).populate('ticket_class_id');
            switch(ticket.ticket_class_id.name){
                case 'Hạng phổ thông':
                    eco.count += 1; 
                    eco.price = ticket.price; 
                    break;
                case 'Hạng phổ thông đặc biệt':
                    pre.count += 1;
                    pre.price = ticket.price;
                    break;
                case 'Hạng thương gia':
                    bus.count += 1;
                    bus.price = ticket.price;
                    break;
                default:
                    break;
            }
            tickets.push(ticket)
        }
    }

    res.render("./flight/checkout-oneway", {
        route,
        ticket,
        tickets,
        eco,
        pre,
        bus,
    });
}

module.exports.postBookingOneWay = async function(req, res){
    console.log(req.body)
    var item = [];

    
    var bill = await Bill.create(new Bill({
        customer_id: req.signedCookies.userID,
        total_payment: req.body.total_price,
        code: shortId.generate().toUpperCase()
    }));
    
    req.body.total_price = parseFloat(req.body.total_price);
    req.body.total_price = req.body.total_price * 0.000043;
    req.body.total_price = req.body.total_price.toFixed(2);
    // 1 ticket
    if (typeof req.body.ticket_id !== 'object'){
        var ticket = await Ticket.findById(req.body.ticket_id);
        var price = (ticket.price * 0.000043).toFixed(2);
        var obj = {
            name: "Vé máy bay",
            sku: ticket.code,
            price: parseFloat(price),
            currency: "USD",
            quantity: 1,
        };
        item.push(obj)
        ticket.status = "Đã đặt";
        ticket.save();
        BillDetail.create(new BillDetail({
            bill_id: bill._id,
            ticket_id: req.body.ticket_id
        }))
    }else{
        for (let i = 0; i < req.body.ticket_id.length; i++) {
            var ticket = await Ticket.findById(req.body.ticket_id[i]);
            var price = (ticket.price * 0.000043).toFixed(2);
            var obj = {
                name: "Vé máy bay",
                sku: ticket.code,
                price: parseFloat(price),
                currency: "USD",
                quantity: 1,
            };
            item.push(obj);

            ticket.status = "Đã đặt";
            ticket.save();
            BillDetail.create(
                new BillDetail({
                    bill_id: bill._id,
                    ticket_id: req.body.ticket_id[i],
                })
            );
            
        }
    }
    payPal(item, req, res)
}

module.exports.roundTrip = async function (req, res) {
    var { route_id, round_trip_id } = req.query;

    var route = await Route.findById(route_id)
        .populate("depart_airport_id")
        .populate("arrival_airport_id");

    var round_trip = await Route.findById(round_trip_id)
        .populate("depart_airport_id")
        .populate("arrival_airport_id")
        .sort({ _id: -1 });

    var eco_class = await TicketClass.findOne({ name: "Hạng phổ thông" });
    var pre_class = await TicketClass.findOne({ name: "Hạng phổ thông đặc biệt" });
    var bus_class = await TicketClass.findOne({ name: "Hạng thương gia" });

    var route_detail = await RouteDetail.find({ route_id })
        .populate("airplane_id")
        .populate("depart_airport_id")
        .populate("arrival_airport_id");

    var route_detail_2 = await RouteDetail.find({ route_id: round_trip_id })
        .populate("airplane_id")
        .populate("depart_airport_id")
        .populate("arrival_airport_id")
        .sort({ _id: -1 });

    var economy_ticket = await Ticket.find({
        route_id: route_id,
        ticket_class_id: eco_class._id,
    });
    var premium_ticket = await Ticket.find({
        route_id: route_id,
        ticket_class_id: pre_class._id,
    });
    var business_ticket = await Ticket.find({
        route_id: route_id,
        ticket_class_id: bus_class._id,
    });

    //round-2
    var economy_ticket_2 = await Ticket.find({
        route_id: round_trip_id,
        ticket_class_id: eco_class._id,
    });
    var premium_ticket_2 = await Ticket.find({
        route_id: round_trip_id,
        ticket_class_id: pre_class._id,
    });
    var business_ticket_2 = await Ticket.find({
        route_id: round_trip_id,
        ticket_class_id: bus_class._id,
    });

    res.render("./flight/booking-roundtrip", {
        route,
        route_detail,
        economy_ticket,
        premium_ticket,
        business_ticket,
        round_trip,
        route_detail_2,
        economy_ticket_2,
        premium_ticket_2,
        business_ticket_2
    });
};

module.exports.getBookingRoundTrip = async function(req, res){
    if (!req.query.ticket_id || !req.query.ticket_id_2) {
        req.flash("danger", "Bạn chưa chọn vé");
        res.redirect(`back`);
        return;
    } else {
        res.locals.flash = undefined;
    }

    var ticket;
    var tickets = [];

    var ticket_2;
    var tickets_2 = [];
    
    var route = await Route.findById(req.params.routeID)
        .populate("depart_airport_id")
        .populate("arrival_airport_id");
        
    var route_2 = await Route.findById(req.params.roundTrip)
        .populate("depart_airport_id")
        .populate("arrival_airport_id");

    var eco = {
        count: 0,
        price: 0,
    };
    var pre = {
        count: 0,
        price: 0,
    };
    var bus = {
        count: 0,
        price: 0,
    };

    var eco_2 = {
        count: 0,
        price: 0,
    };
    var pre_2 = {
        count: 0,
        price: 0,
    };
    var bus_2 = {
        count: 0,
        price: 0,
    };
    //select 1 ticket
    if (typeof req.query.ticket_id !== "object") {
        ticket = await Ticket.findById(req.query.ticket_id).populate(
            "ticket_class_id"
        );
        switch (ticket.ticket_class_id.name) {
            case "Hạng phổ thông":
                eco.count += 1;
                eco.price = ticket.price;
                break;
            case "Hạng phổ thông đặc biệt":
                pre.count += 1;
                pre.price = ticket.price;
                break;
            case "Hạng thương gia":
                bus.count += 1;
                bus.price = ticket.price;
                break;
            default:
                break;
        }
    } else {
        for (let i = 0; i < req.query.ticket_id.length; i++) {
            var ticket = await Ticket.findById(req.query.ticket_id[i]).populate(
                "ticket_class_id"
            );
            switch (ticket.ticket_class_id.name) {
                case "Hạng phổ thông":
                    eco.count += 1;
                    eco.price = ticket.price;
                    break;
                case "Hạng phổ thông đặc biệt":
                    pre.count += 1;
                    pre.price = ticket.price;
                    break;
                case "Hạng thương gia":
                    bus.count += 1;
                    bus.price = ticket.price;
                    break;
                default:
                    break;
            }
            tickets.push(ticket);
        }
    }

    if (typeof req.query.ticket_id_2 !== "object") {
        ticket_2 = await Ticket.findById(req.query.ticket_id_2).populate(
            "ticket_class_id"
        );
        switch (ticket_2.ticket_class_id.name) {
            case "Hạng phổ thông":
                eco_2.count += 1;
                eco_2.price = ticket_2.price;
                break;
            case "Hạng phổ thông đặc biệt":
                pre_2.count += 1;
                pre_2.price = ticket_2.price;
                break;
            case "Hạng thương gia":
                bus_2.count += 1;
                bus_2.price = ticket_2.price;
                break;
            default:
                break;
        }
    } else {
        for (let i = 0; i < req.query.ticket_id_2.length; i++) {
            var ticket_2 = await Ticket.findById(req.query.ticket_id_2[i]).populate(
                "ticket_class_id"
            );
            switch (ticket_2.ticket_class_id.name) {
                case "Hạng phổ thông":
                    eco_2.count += 1;
                    eco_2.price = ticket_2.price;
                    break;
                case "Hạng phổ thông đặc biệt":
                    pre_2.count += 1;
                    pre_2.price = ticket_2.price;
                    break;
                case "Hạng thương gia":
                    bus_2.count += 1;
                    bus_2.price = ticket_2.price;
                    break;
                default:
                    break;
            }
            tickets_2.push(ticket_2);
        }
    }

    res.render("./flight/checkout-roundtrip", {
        route,
        ticket,
        tickets,
        eco,
        pre,
        bus,
        route_2,
        ticket_2,
        tickets_2,
        eco_2,
        pre_2,
        bus_2,
    });
}

module.exports.postBookingRoundTrip = async function (req, res) {
    console.log(req.body);
    var item = []
    req.body.total_price = parseFloat(req.body.total_price) + parseFloat(req.body.total_price_2);
    var bill = await Bill.create(
        new Bill({
            customer_id: req.signedCookies.userID,
            total_payment: req.body.total_price,
            code: shortId.generate().toUpperCase(),
        })
    );
    req.body.total_price = req.body.total_price * 0.000043;
    req.body.total_price = req.body.total_price.toFixed(2);
    // // 1 ticket
    if (typeof req.body.ticket_id !== "object") {
        var ticket = await Ticket.findById(req.body.ticket_id);

        var obj = {
            name: "Vé máy bay",
            sku: ticket.code,
            price: (ticket.price * 0.000043).toFixed(2),
            currency: "USD",
            quantity: 1,
        };
        item.push(obj);

        ticket.status = "Đã đặt";
        ticket.save();
        BillDetail.create(
            new BillDetail({
                bill_id: bill._id,
                ticket_id: req.body.ticket_id,
            })
        );
    } else {
        for (let i = 0; i < req.body.ticket_id.length; i++) {
            var ticket = await Ticket.findById(req.body.ticket_id[i]);

            var obj = {
                name: "Vé máy bay",
                sku: ticket.code,
                price: (ticket.price * 0.000043).toFixed(2),
                currency: "USD",
                quantity: 1,
            };
            item.push(obj);

            ticket.status = "Đã đặt";
            ticket.save();
            BillDetail.create(
                new BillDetail({
                    bill_id: bill._id,
                    ticket_id: req.body.ticket_id[i],
                })
            );
        }
    }

    if (typeof req.body.ticket_id_2 !== "object") {
        var ticket = await Ticket.findById(req.body.ticket_id_2);

        var obj = {
            name: "Vé máy bay",
            sku: ticket.code,
            price: (ticket.price * 0.000043).toFixed(2),
            currency: "USD",
            quantity: 1,
        };
        item.push(obj);

        ticket.status = "Đã đặt";
        ticket.save();
        BillDetail.create(
            new BillDetail({
                bill_id: bill._id,
                ticket_id: req.body.ticket_id_2,
            })
        );
    } else {
        for (let i = 0; i < req.body.ticket_id_2.length; i++) {
            var ticket = await Ticket.findById(req.body.ticket_id_2[i]);

            var obj = {
                name: "Vé máy bay",
                sku: ticket.code,
                price: (ticket.price * 0.0000043).toFixed(2),
                currency: "USD",
                quantity: 1,
            };
            item.push(obj);

            ticket.status = "Đã đặt";
            ticket.save();
            BillDetail.create(
                new BillDetail({
                    bill_id: bill._id,
                    ticket_id: req.body.ticket_id_2[i],
                })
            );
        }
    }
    console.log(item, req.body.total_price);
    payPal(item, req, res)
};

var payPal = (item, req, res) => {
    var create_payment_json = {
        intent: "sale",
        payer: {
            payment_method: "paypal",
        },
        redirect_urls: {
            return_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/fail",
        },
        transactions: [
            {
                item_list: {
                    items: item,
                },
                amount: {
                    currency: "USD",
                    total: req.body.total_price,
                },
                description: "This is the payment description.",
            },
        ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    res.redirect(payment.links[i].href);
                }
            }
        }
    });
}