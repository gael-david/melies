// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const rating = require('../controllers/rating');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');

router.get('/', wrapAsync(rating.ratingPage));

router.put('/', wrapAsync(rating.addRating));

router.delete('/', wrapAsync(rating.removeRating));

module.exports = router;