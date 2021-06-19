const Airplane = require("../models/airplane.model");
const AirplaneCompany = require('../models/airplane_company.model');
const _ = require("lodash");

module.exports.get = async function (req, res) {
    var airplanes = await Airplane.find();
    var airplane_company = await AirplaneCompany.find();

    for (let index = 0; index < airplanes.length; index++) {
        var company = await AirplaneCompany.findById(airplanes[index].airplane_company_id);
        airplanes[index].company = company.name
    }

    res.render("./airplane/index", {
        airplanes,
        airplane_company,
    });
};

module.exports.postCreate = async function (req, res) {
    Airplane.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    var airplane = await Airplane.findById(req.params.airplaneID);
    var airplane_company = await AirplaneCompany.find();

    res.render("./airplane/edit", {
        airplane,
        airplane_company,
    });
};

module.exports.postEdit = async function (req, res) {
    var airplane = await Airplane.findById(req.params.airplaneID);
    _.extend(airplane, req.body);
    airplane.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/airplanes");
};

module.exports.delete = async function (req, res) {
    Airplane.findByIdAndDelete(req.params.airplaneID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};
