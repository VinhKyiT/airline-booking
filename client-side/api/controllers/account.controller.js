const Bill = require("../../models/bill.model");
var Customer = require("../../models/customer.model");

module.exports.get = async function (req, res) {
    var customer = await Customer.findById(req.signedCookies.userID);
    if (customer) {
        var totalOrderValue = 0;
        var bills = await Bill.find({customer_id: customer._id})

        bills.forEach(item => {
            totalOrderValue += item.total_payment;
        })

        var api = {
            username: customer.username,
            email: customer.email,
            date: customer.d_c,
            totalOrderValue,
        };

        res.json(api);
    }
};
