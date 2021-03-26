// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const home = require('../controllers/home');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');

router.get('/', wrapAsync(home.homepage));

module.exports = router;