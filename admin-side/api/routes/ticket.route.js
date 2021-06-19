const express = require("express");
const router = express.Router();
const controller = require("../controllers/ticket.controller");

router.get("/:routeID/:ticket_class_id", controller.getTicketByRouteID);
router.get("/:routeID/:ticket_class_id/:code", controller.getTicketByCode);

module.exports = router;
