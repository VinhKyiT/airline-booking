const Account = require('../models/account.model');
const md5 = require('md5')

module.exports.getLogin = function(req, res){
    res.render('./authentication/login')
}

module.exports.postLogin = async function(req, res){
    const { username, password } = req.body;
    var account = await Account.findOne({ username });
    if (!account) {
        res.render("./authentication/login", {
            error: "Account doesn't exist!",
        });
        return;
    } else {
        if (md5(password) !== account.password) {
            res.render("./authentication/login", {
                error: "Wrong password!",
            });
            return;
        } else {
            res.cookie("adminID", account._id, {
                signed: true,
            });
            res.redirect("/");
            return;
        }
    }
}

module.exports.logOut = function(req, res){
    res.clearCookie("adminID");
    res.redirect("/authentication/login");
}