const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentication.controller");

router.get("/login", controller.getLogin);
router.get("/logout", controller.logOut);

router.post("/login", controller.postLogin);

module.exports = router;
