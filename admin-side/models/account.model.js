var mongoose = require("mongoose");
const md5 = require('md5')

var accountSchema = new mongoose.Schema({
    username: String,
    password: {
        type: String,
        default: md5('123')
    },
    role_id: String,
    name: String,
    date_of_birth: Date,
    email: String,
    phone: String,
    gender: String,
});

accountSchema.virtual("date").get(function () {
    var m = this.date_of_birth.getMonth() + 1;
    var d = this.date_of_birth.getDate();
    var y = this.date_of_birth.getFullYear();
    return d + "/" + m + "/" + y;
});

var Account = mongoose.model("Account", accountSchema, "account");

module.exports = Account;
