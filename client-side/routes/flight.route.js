const express = require("express");
const router = express.Router();
const controller = require("../controllers/flight.controller");

const authMiddleware = require('../middleware/auth.middleware');

router.get("/", controller.get);

router.get("/search", controller.search);

router.get("/booking/one-way", controller.oneWay);
router.get("/booking/one-way/:routeID", authMiddleware.redirect, controller.getBookingOneWay);
router.post("/booking/one-way/:routeID", authMiddleware.redirect, controller.postBookingOneWay);

router.get("/booking/round-trip", controller.roundTrip);
router.get("/booking/round-trip/:routeID/:roundTrip", controller.getBookingRoundTrip);
router.post("/booking/round-trip/:routeID/:roundTrip", controller.postBookingRoundTrip);

module.exports = router;
