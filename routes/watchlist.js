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

router.put('/', wrapAsync(async function (req, res,next) {
    const id = Number(req.body.id);
    const film = req.body;

    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;
    const inWatchlist = watchlist.some(e => e.id === id);

    if (!inWatchlist) {
        watchlistData.watchlist.push(film);
        await watchlistData.save();
    }

    res.redirect('back');
}))

router.delete('/', wrapAsync(async function (req,res,next) {
    const id = Number(req.body.id);
    const film = req.body;

    let watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const inWatchlist = watchlistData.watchlist.some(e => e.id === id);

    if (inWatchlist) {
        watchlistData.watchlist = watchlistData.watchlist.filter(e => e.id !== id);
        await watchlistData.save();
    }
    res.redirect('back');
}))

module.exports = router;