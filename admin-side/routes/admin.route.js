const express = require("express");
const router = express.Router();
const controller = require("../controllers/admin.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/",authenticationMiddleware, controller.get);
router.get("/delete/:adminID",authenticationMiddleware, controller.delete);
router.get("/edit/:adminID",authenticationMiddleware, controller.getEdit);

router.post("/create",authenticationMiddleware, controller.postCreate);
router.post("/edit/:adminID",authenticationMiddleware, controller.postEdit);

module.exports = router;
