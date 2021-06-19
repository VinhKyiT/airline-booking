const Airport = require("../models/airport.model");
const _ = require("lodash");

module.exports.get = async function (req, res) {
    var airports = await Airport.find();

    res.render("./airport/index", {
        airports,
    });
};

module.exports.postCreate = async function (req, res) {
    Airport.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    var airport = await Airport.findById(req.params.airportID);

    res.render("./airport/edit", {
        airport,
    });
};

module.exports.postEdit = async function (req, res) {
    var airport = await Airport.findById(req.params.airportID);
    _.extend(airport, req.body);
    airport.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/airports");
};

module.exports.delete = async function (req, res) {
    Airport.findByIdAndDelete(req.params.airportID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};
