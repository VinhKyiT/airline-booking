const express = require("express");
const router = express.Router();
const controller = require("../controllers/bill.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/", authenticationMiddleware, controller.get);
router.get("/edit/:billID", authenticationMiddleware, controller.getEdit);
router.get("/edit-cancel/:cancelID", authenticationMiddleware, controller.getEditCancel);
router.post("/edit-cancel/:cancelID", authenticationMiddleware, controller.postEditCancel);

module.exports = router;
