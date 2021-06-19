const Account = require('../models/account.model');
const Role = require('../models/role.model');

module.exports = async function(req, res, next){
    var adminID = req.signedCookies.adminID
    if (!adminID) {
        res.redirect("/authentication/login");
        return;
    }

    var account = await Account.findById(adminID);
    var role = await Role.findById(account.role_id);

    res.locals.admin = account
    res.locals.role = role.name;

    next();
}