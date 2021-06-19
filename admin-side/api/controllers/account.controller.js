const Account = require('../../models/account.model');
const Role = require("../../models/role.model");

module.exports.getCurrentAccount = async function(req, res){
    var adminID = req.signedCookies.adminID;

    var account = await Account.findById(adminID);
    var role = await Role.findById(account.role_id);

    var obj = {
        ...account._doc,
        role: role.name
    }

    res.json(obj)
}