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
const User = require('../models/user');
// GET DATA FROM "FAKE DB"
const {randomFilmGenre} = require('../public/js/genres');
const {allFilmGenres} = require('../public/js/genres');
const {discoverFilmsID} = require('../public/js/discover');
// REQUIRE & CONFIG PASSPORT
const passport = require('passport');

router.get('/signup', wrapAsync(async function (req,res,next) {
    res.render("./user/signup", {name: "Sign up - MELIES"})
}))

router.post('/signup', wrapAsync(async function (req,res,next) {
    try {
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);
        console.log(registeredUser)
        req.login(registeredUser, err => {if (err) return next(err);})
        req.flash('success', 'Welcome to Melies!')
        res.redirect("/");
    } catch (error) {
    req.flash('error', error.message)
    console.log(error)
    res.redirect("/signup");
    }
}))

router.get('/login', wrapAsync(async function (req,res,next) {
    res.render("./user/login", {name: "Login - MELIES"})
}))

router.post('/login', passport.authenticate('local', {failureFlash: true, failureRedirect: '/login'}), wrapAsync(async function (req,res,next) {
    req.flash('success', 'Successfully logged in!');

    const redirectURL = req.session.returnTo || '/';
    delete req.session.returnTo
    res.redirect(redirectURL)
}))

router.get('/logout', wrapAsync(async function (req,res,next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        req.logout();
        req.flash('success', 'Successfully logged out');
        res.redirect('/');
    }
}))

module.exports = router;