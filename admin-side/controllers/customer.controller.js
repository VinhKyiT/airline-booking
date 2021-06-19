const Customer = require("../models/customer.model");
const _ = require("lodash");

module.exports.get = async function (req, res) {
    var customers = await Customer.find();

    res.render("./customer/index", {
        customers,
    });
};

module.exports.postCreate = async function (req, res) {
    Customer.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    var customer = await Customer.findById(req.params.customerID);

    res.render("./customer/edit", {
        customer,
    });
};

module.exports.postEdit = async function (req, res) {
    var customer = await Customer.findById(req.params.customerID);
    _.extend(customer, req.body);
    customer.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/customers");
};

module.exports.delete = async function (req, res) {
    Customer.findByIdAndDelete(req.params.customerID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};
