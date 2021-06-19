const express = require("express");
const router = express.Router();
const controller = require("../controllers/airport.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/",authenticationMiddleware, controller.get);
router.get("/delete/:airportID",authenticationMiddleware, controller.delete);
router.get("/edit/:airportID",authenticationMiddleware, controller.getEdit);

router.post("/create",authenticationMiddleware, controller.postCreate);
router.post("/edit/:airportID",authenticationMiddleware, controller.postEdit);

module.exports = router;
