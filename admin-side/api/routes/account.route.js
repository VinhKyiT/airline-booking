const express = require("express");
const router = express.Router();
const controller = require("../controllers/account.controller");

router.get("/", controller.getCurrentAccount);

module.exports = router;
