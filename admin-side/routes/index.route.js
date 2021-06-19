const homeRoute = require('./home.route');
const airplaneCompanyRoute = require('./airplane_company.route');
const airportCompanyRoute = require("./airport.route");
const airplaneRoute = require("./airplane.route");
const routeRoute = require("./route.route");
const customerRoute = require("./customer.route");
const staffRoute = require("./staff.route");
const adminRoute = require("./admin.route");
const roleRoute = require("./role.route");
const authenticationRoute = require("./authentication.route");
const ticketRoute = require('./ticket.route')
const profileRoute = require("./profile.route");
const billRoute = require("./bill.route");

//api
const accountAPI = require('../api/routes/account.route');
const ticketAPI = require("../api/routes/ticket.route");

const router = function(app){
    app.use("/", homeRoute);
    app.use("/airplane-company", airplaneCompanyRoute);
    app.use("/airports", airportCompanyRoute);
    app.use("/airplanes", airplaneRoute);
    app.use("/routes", routeRoute);
    app.use("/customers", customerRoute);
    app.use("/staffs", staffRoute);
    app.use("/admins", adminRoute);
    app.use("/roles", roleRoute);
    app.use("/authentication", authenticationRoute);
    app.use("/tickets", ticketRoute);
    app.use("/profiles", profileRoute);
    app.use("/bills", billRoute);
    
    app.use("/api/account", accountAPI);
    app.use("/api/ticket", ticketAPI);
}

module.exports = router;