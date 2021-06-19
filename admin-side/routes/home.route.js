const express = require('express');
const router = express.Router();
const controller = require('../controllers/home.controller');

const authenticationMiddleware = require("../middlewares/authentication.middleware");

router.get('/', authenticationMiddleware, controller.get);

module.exports = router;