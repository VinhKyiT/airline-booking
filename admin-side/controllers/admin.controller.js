const Account = require("../models/account.model");
const Role = require('../models/role.model');
const _ = require("lodash");

module.exports.get = async function (req, res) {
    var roleAdmin = await Role.findOne({name: 'admin'});
    var admins = await Account.find({ role_id: roleAdmin._id });

    res.render("./admin/index", {
        admins,
    });
};

module.exports.postCreate = async function (req, res) {
    var roleAdmin = await Role.findOne({ name: "admin" });
    req.body.role_id = roleAdmin._id
    Account.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    var admin = await Account.findById(req.params.adminID);

    res.render("./staff/edit", {
        admin,
    });
};

module.exports.postEdit = async function (req, res) {
    var admin = await Account.findById(req.params.adminID);
    _.extend(admin, req.body);
    admin.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/staffs");
};

module.exports.delete = async function (req, res) {
    Account.findByIdAndDelete(req.params.adminID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};
