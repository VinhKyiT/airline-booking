const express = require("express");
const router = express.Router();
const controller = require("../controllers/route.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/",authenticationMiddleware, controller.get);
router.get("/delete/:routeID",authenticationMiddleware, controller.delete);
router.get("/edit/:routeID",authenticationMiddleware, controller.getEdit);

router.post("/create",authenticationMiddleware, controller.postCreate);
router.post("/edit/:routeID",authenticationMiddleware, controller.postEdit);
router.post("/add-station/:routeID",authenticationMiddleware, controller.addStation);

module.exports = router;
