const express = require("express");
const router = express.Router();
const controller = require("../controllers/authentication.controller");

router.get("/", controller.get);
router.get('/logout', controller.logOut)

router.post("/login", controller.postLogin);
router.post('/signUp', controller.postSignUp)

module.exports = router;
