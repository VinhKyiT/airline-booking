const Role = require("../models/role.model");
const _ = require("lodash");
const Account = require("../models/account.model");

module.exports.get = async function (req, res) {
    var roles = await Role.find();

    for (let i = 0; i < roles.length; i++) {
        var account = await Account.find({ role_id: roles[i]._id });

        roles[i].account = account.length;
    }

    res.render("./role/index", {
        roles,
    });
};

module.exports.postCreate = async function (req, res) {
    Role.create(req.body, (err, docs) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};

module.exports.getEdit = async function (req, res) {
    var role = await Role.findById(req.params.roleID);

    res.render("./role/edit", {
        role,
    });
};

module.exports.postEdit = async function (req, res) {
    var role = await Role.findById(req.params.roleID);
    _.extend(role, req.body);
    role.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.redirect("/roles");
};

module.exports.delete = async function (req, res) {
    Role.findByIdAndDelete(req.params.roleID, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.redirect("back");
};
