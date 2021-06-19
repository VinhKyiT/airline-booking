const express = require("express");
const router = express.Router();
const controller = require("../controllers/role.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/", authenticationMiddleware, controller.get);
router.get("/delete/:roleID", authenticationMiddleware, controller.delete);
router.get("/edit/:roleID", authenticationMiddleware, controller.getEdit);

router.post("/create", authenticationMiddleware, controller.postCreate);
router.post("/edit/:roleID", authenticationMiddleware, controller.postEdit);

module.exports = router;
