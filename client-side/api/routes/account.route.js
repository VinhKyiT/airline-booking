var express = require("express");
var router = express.Router();
var controller = require("../controllers/account.controller");

router.get("/current-account", controller.get);

module.exports = router;
