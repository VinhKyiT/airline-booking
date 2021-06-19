var mongoose = require("mongoose");

var routeDetailSchema = new mongoose.Schema({
    route_id: String,
    airplane_id: {
        type: String,
        ref: "Airplane",
    },
    depart_airport_id: {
        type: String,
        ref: "Airport",
    },
    arrival_airport_id: {
        type: String,
        ref: "Airport",
    },
    status_id: String,
});

var RouteDetail = mongoose.model("RouteDetail", routeDetailSchema, "route_detail");

module.exports = RouteDetail;
