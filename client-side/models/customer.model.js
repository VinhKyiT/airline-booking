var mongoose = require("mongoose");

var customerSchema = new mongoose.Schema({
    username: String, 
    password: String,
    name: String,
    date_of_birth: Date,
    email: String,
    phone: String,
    gender: String,
    cmnd: String,
    job: String,
    date_create: {
        type: Date,
        default: new Date()
    }
});

customerSchema.virtual('date').get( function() {
    var m = this.date_of_birth.getMonth() + 1;
    var d = this.date_of_birth.getDate();
    var y = this.date_of_birth.getFullYear();
    return d + "/" + m + "/" + y;
})

customerSchema.virtual('d_c').get( function() {
    var m = this.date_create.getMonth() + 1;
    var d = this.date_create.getDate();
    var y = this.date_create.getFullYear();
    return d + "/" + m + "/" + y;
})

var Customer = mongoose.model("Customer", customerSchema, "customer");

module.exports = Customer;
