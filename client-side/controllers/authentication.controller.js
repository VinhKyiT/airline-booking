const Customer = require('../models/customer.model');
const md5 = require('md5')

module.exports.get = function (req, res) {
    res.render("./authentication/index");
};

module.exports.postLogin = async function(req, res){
    var { username, password } = req.body;

    var cusByEmail = await Customer.findOne({ email: username });
    var cusByUsername = await Customer.findOne({ username });

    if (!cusByEmail && !cusByUsername) {
        res.render("./authentication/index", {
            notification: {
                type: "danger",
                message: "Account doesn't exist!",
            },
        });
        return;
    }

    if (!cusByEmail){
        if (md5(password) !== cusByUsername.password) {
            res.render("./authentication/index", {
                notification: {
                    type: "danger",
                    message: "Your password is not correct!",
                },
            });
            return;
        }

        res.cookie("userID", cusByUsername._id, {
            signed: true,
        });

    }else if (!cusByUsername){
        if (md5(password) !== cusByEmail.password) {
            res.render("./authentication/index", {
                notification: {
                    type: "danger",
                    message: "Your password is not correct!",
                },
            });
            return;
        }

        res.cookie("userID", cusByEmail._id, {
            signed: true,
        });
    }

    res.redirect('/')
}

module.exports.postSignUp = async function(req, res){
    var {username, email, password, confirmPassword} = req.body;

    var cusByEmail = await Customer.findOne({email})
    var cusByUsername = await Customer.findOne({username})

    if (cusByEmail || cusByUsername){
        res.render("./authentication/index", {
            notification: {
                type: "danger",
                message: "Account already exist!",
            },
        });
        return;
    }

    if (password !== confirmPassword){
        res.render("./authentication/index", {
            notification: {
                type: "danger",
                message: "Confirm password incorrect!",
            }
        });
        return;
    }

    req.body.password = md5(password)
    Customer.create(req.body)
    
    res.render("./authentication/index", {
        notification: {
            type: "success",
            message: "Sign Up successed!",
        },
    });
}

module.exports.logOut = function(req, res){
    res.clearCookie("userID");
    res.redirect("/");
}