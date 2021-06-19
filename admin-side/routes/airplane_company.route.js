const express = require("express");
const router = express.Router();
const controller = require("../controllers/airplane_company.controller");

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get("/",authenticationMiddleware, controller.get);
router.get("/delete/:companyID",authenticationMiddleware, controller.delete);
router.get("/edit/:companyID",authenticationMiddleware, controller.getEdit);

router.post('/create',authenticationMiddleware, controller.postCreate)
router.post("/edit/:companyID",authenticationMiddleware, controller.postEdit);

module.exports = router;
