const Account = require("../models/account.model");
const Role = require("../models/role.model");
const _ = require("lodash");

module.exports.get = async function (req, res) {
    var roleStaff = await Role.findOne({ name: "staff" });
    var staffs = await Account.find({role_id: roleStaff._id});

    res.render("./staff/index", {
        staffs,
    });
};

module.exports.postCreate = async function (req, res) {
    var roleStaff = await Role.findOne({ name: "staff" });
    req.body.role_id = roleStaff._id
    Account.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    var staff = await Account.findById(req.params.staffID);

    res.render("./staff/edit", {
        staff,
    });
};

module.exports.postEdit = async function (req, res) {
    var staff = await Account.findById(req.params.staffID);
    _.extend(staff, req.body);
    staff.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/staffs");
};

module.exports.delete = async function (req, res) {
    Account.findByIdAndDelete(req.params.staffID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};
