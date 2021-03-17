// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE AXIOS
const axios = require('axios');
// REQUIRE COOKIE-PARSER
const cookieParser = require('cookie-parser');
// REQUIRE JOI (SERVER-SIDE SCHEMA VALIDATION)
const Joi = require('joi');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');
// REQUIRE MONGODB MODELS
const Collection = require('../models/collection');
const Watchlist = require('../models/watchlist');
// GET DATA FROM "FAKE DB"
const {randomFilmGenre} = require('../public/js/genres');
const {allFilmGenres} = require('../public/js/genres');
const {discoverFilmsID} = require('../public/js/discover');

router.get('/', wrapAsync(async function (req,res,next) {
    res.render("./user/signup", {name: "Sign up - MELIES"})
}))

router.post('/', wrapAsync(async function (req,res,next) {
    res.redirect("/")
}))

module.exports = router;