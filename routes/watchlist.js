// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const watchlist = require('../controllers/watchlist');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');

router.get('/watchlist', wrapAsync(watchlist.watchlistPage));

router.put('/watchlist', wrapAsync(watchlist.addToWatchlist));

router.delete('/watchlist', wrapAsync(watchlist.removeFromWatchlist));

module.exports = router;