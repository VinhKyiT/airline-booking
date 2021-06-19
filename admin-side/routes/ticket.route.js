const express = require("express");
const router = express.Router();
const controller = require("../controllers/ticket.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/", authenticationMiddleware, controller.get);
router.get("/change-status/:ticketID", authenticationMiddleware, controller.changeStatus);

module.exports = router;
