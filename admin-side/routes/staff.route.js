const express = require("express");
const router = express.Router();
const controller = require("../controllers/staff.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/", authenticationMiddleware, controller.get);
router.get("/delete/:staffID", authenticationMiddleware, controller.delete);
router.get("/edit/:staffID", authenticationMiddleware, controller.getEdit);

router.post("/create", authenticationMiddleware, controller.postCreate);
router.post("/edit/:staffID", authenticationMiddleware, controller.postEdit);

module.exports = router;
