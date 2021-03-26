// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const film = require('../controllers/film');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');

// ROUTES
router.get('/search', wrapAsync(film.search));

router.get('/:filmID', wrapAsync(film.page));

router.get('/genre/:genreID/:genrePage', wrapAsync(film.genre))

module.exports = router;