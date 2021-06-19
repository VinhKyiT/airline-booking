const Bill = require('../models/bill.model')
const BillDetail = require('../models/bill_detail.model')
const Cancel = require('../models/cancel.model')
const Ticket = require('../models/ticket.model')
const _ = require("lodash");

module.exports.get = async function (req, res) {
    var bills = await Bill.find().populate('customer_id')
    var cancels = await Cancel.find()
        .populate("ticket_id")
        .populate("customer_id")
        .sort({ status: 1 });


    res.render("./bill/index", {
        bills,
        cancels,
    });
};

module.exports.getEdit = async function (req, res) {
    var bill = await Bill.findById(req.params.billID)

    var bill_detail = await BillDetail.find({ bill_id: bill._id }).populate('ticket_id');

    var tickets = []

    for (let i = 0; i < bill_detail.length; i++) {
        var ticket = await Ticket.findById(bill_detail[i].ticket_id).populate('ticket_class_id');

        tickets.push(ticket)
    }

    res.render("./bill/editBill", {
        bill,
        bill_detail,
        tickets,
    });
};

module.exports.getEditCancel = async function (req, res) {
    var cancel = await Cancel.findById(req.params.cancelID).populate('ticket_id').populate('customer_id');
    console.log(cancel)
    res.render("./bill/editCancel", {
        cancel
    });
};

module.exports.postEditCancel = async function (req, res) {
    var cancel = await Cancel.findById(req.params.cancelID);
    
    cancel.status = req.body.status
    cancel.save();

    res.redirect("/bills");
};


