// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const watchlist = require('../controllers/watchlist');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');

router.get('/', wrapAsync(watchlist.watchlistPage));

router.put('/', wrapAsync(watchlist.addToWatchlist));

router.delete('/', wrapAsync(watchlist.removeFromWatchlist));

module.exports = router;