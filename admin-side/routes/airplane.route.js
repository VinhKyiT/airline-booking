const express = require("express");
const router = express.Router();
const controller = require("../controllers/airplane.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/",authenticationMiddleware, controller.get);
router.get("/delete/:airplaneID",authenticationMiddleware, controller.delete);
router.get("/edit/:airplaneID",authenticationMiddleware, controller.getEdit);

router.post("/create",authenticationMiddleware, controller.postCreate);
router.post("/edit/:airplaneID",authenticationMiddleware, controller.postEdit);

module.exports = router;
