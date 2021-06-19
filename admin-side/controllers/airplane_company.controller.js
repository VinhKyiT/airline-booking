const AirplaneCompany = require('../models/airplane_company.model')
const Airplane = require('../models/airplane.model')
const _ = require("lodash");

module.exports.get = async function(req, res){
    var airplane_company = await AirplaneCompany.find();

    for (let i = 0; i < airplane_company.length; i++) {
        var airplane = await Airplane.find({airplane_company_id: airplane_company[i]._id})
        airplane_company[i].plane = airplane.length
    }
    res.render("./airplane_company/index", {
        airplane_company,
    });
}

module.exports.postCreate = async function(req, res){
    AirplaneCompany.create(req.body, (err, docs) => {
        if (err){
            console.log(err)
        }
    });

    res.redirect('back');
}

module.exports.getEdit = async function (req, res) {
    var airplane_company = await AirplaneCompany.findById(req.params.companyID);

    res.render("./airplane_company/edit", {
        airplane_company,
    });
};

module.exports.postEdit = async function (req, res) {
    var airplane_company = await AirplaneCompany.findById(req.params.companyID);
    _.extend(airplane_company, req.body)
    airplane_company.save((err, docs) => {
        if (err){
            console.log(err)
        }
    })
    res.redirect("/airplane-company");
};

module.exports.delete = async function (req, res) {
    AirplaneCompany.findByIdAndDelete(req.params.companyID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    var airplanes = await Airplane.find({ airplane_company_id: req.params.companyID });

    for (let i = 0; i < airplanes.length; i++) {
        await Airplane.findByIdAndDelete(airplanes[i]._id);
    }

    res.redirect("back");
};