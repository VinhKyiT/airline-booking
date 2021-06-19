var express = require("express");
var router = express.Router();
var controller = require("../controllers/profile.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/", authenticationMiddleware, controller.get);
router.get("/change-password",authenticationMiddleware, controller.getChangePass);

router.post("/",authenticationMiddleware, controller.postProfile);
router.post("/change-password",authenticationMiddleware, controller.postChangePass);
module.exports = router;