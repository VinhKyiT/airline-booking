const homeRoute = require('./home.route');
const flightRoute = require("./flight.route");
const authenticationRoute = require('./authentication.route');
const profileRoute = require("./profile.route");

//api
const currentUserAPI = require('../api/routes/account.route')

const authMiddleware = require("../middleware/auth.middleware");

const router = function(app) {
    app.use(authMiddleware);
    app.use("/", homeRoute);
    app.use("/authentication", authenticationRoute);
    app.use("/flights", flightRoute);
    app.use("/profile", profileRoute);
    
    //api
    app.use("/api", currentUserAPI);

};

module.exports = router;
