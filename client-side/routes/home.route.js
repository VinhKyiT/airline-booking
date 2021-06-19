const express = require('express');
const router = express.Router();
const controller = require('../controllers/home.controller');

const authMiddleware = require("../middleware/auth.middleware");

router.get('/', controller.get);

module.exports = router