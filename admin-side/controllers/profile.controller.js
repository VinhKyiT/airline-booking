const Role = require('../models/role.model')
const Account = require('../models/account.model');
const md5 = require('md5')
const _ = require('lodash');

module.exports.get = async function (req, res) {
    res.render("./profile/profile", {
        admin: res.locals.admin,
        role: res.locals.role,

    });
};
module.exports.getChangePass = async function(req, res){
    res.render('./profile/password')
}
module.exports.postChangePass = async function(req, res){
    var admin  = await Account.findById(res.locals.admin._id);
    const {old_pass, new_pass, confirm_newPass} = req.body

    if (confirm_newPass !== new_pass) {
        res.render("./profile/password", {
            error: "Mật khẩu xác nhận không đúng!",
        });
        return;
    }
    if (md5(old_pass) !== admin.password) {
        res.render("./profile/password", {
            error: "Mật khẩu cũ không đúng!",
        });
        return;
    }
    admin.password = md5(new_pass);
    admin.save();

    res.redirect('back')
}
module.exports.postProfile = async function(req, res){
    var currentAdmin = await Account.findById(res.locals.admin._id);
    
    _.extend(currentAdmin, req.body)

    currentAdmin.save();

    res.redirect('back');
}
