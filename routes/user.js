// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const user = require('../controllers/user');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');
// REQUIRE & CONFIG PASSPORT
const passport = require('passport');

router.get('/signup', wrapAsync(user.signupPage));

router.post('/signup', wrapAsync(user.signup));

router.get('/login', wrapAsync(user.loginPage));

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), wrapAsync(user.login));

router.get('/logout', wrapAsync(user.logout));

module.exports = router;