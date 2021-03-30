// #############
// CONFIGURATION
// #############

// REQUIRE ENV
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// EXPRESS INIT
const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '/public')))

// MONGOOSE INIT
const mongoose = require('mongoose');
const dbURL = process.env.ATLAS_URI;

mongoose.connect(dbURL, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        console.log("CONNECTION OPEN!")
    })
    .catch(function (err) {
        console.log("OH NO, ERROR!")
        console.log(err)
    })

// CONFIGURE MONGO SANITAZER (SECURITY)
const mongoSanitize = require('express-mongo-sanitize');
app.use(mongoSanitize());

// REQUIRE MONGODB MODELS
const Collection = require('./models/collection');
const Watchlist = require('./models/watchlist');
const User = require('./models/user');
const Score = require('./models/score');
const Rating = require('./models/rating');


// REQUIRE COOKIE-PARSER
const cookieParser = require('cookie-parser');

// CONFIGURE EXPRESS-SESSION & CONNECT-MONGO (to use MongoDB as a session manager)
const secret = process.env.SECRET || 'thisshouldbebetter!'
const session = require('express-session');
const MongoStore = require('connect-mongo');
const store = new MongoStore({
    mongoUrl: dbURL,
    secret: secret,
    touchAfter: 24 * 60 * 60
});
const sessionConfig = {
    store: store,
    name: 'session',
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24
    }
};
app.use(session(sessionConfig));

// EJS CONFIG
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// ENABLE FORM DATA PARSING & OTHER HTTP METHODS (DELETE, PATCH)
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ENABLE CORS TO MAKE API POST/DELETE REQUESTS
const cors = require('cors');
app.use(cors());

// REQUIRE & CONFIG FLASH
const flash = require('connect-flash')
app.use(flash())

// REQUIRE & CONFIG PASSPORT
const passport = require('passport');
const LocalStrategy = require('passport-local');
app.use(passport.initialize());
app.use(passport.session());
// Tell Passport to use the local strategy (could also be Google, Facebook...)
passport.use(User.createStrategy());
// Store and unstore user in a session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// REQUIRE UTILITIES
const ExpressError = require('./utilities/ExpressError');

// REQUIRE HELMET (HTTP SECURITY)
const helmet = require('helmet');
app.use(helmet({contentSecurityPolicy: false}));

// #############
// MIDDLEWARES
// #############

// FLASH MIDDLEWARE
app.use(function(req, res, next) {
    res.locals.flash = req.flash()
    next();
})

// GET CURRENT USER
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
})

// GET WATCHLIST
app.use(async function (req,res, next) {
    if (req.isAuthenticated()) {
        const {watchlist} = await Watchlist.findOne({ 'user': req.user._id });
        res.locals.watchlist = watchlist;
        next();
    } else {
        res.locals.watchlist = [];
        next();
    }
})

// GET SCORE DATA
app.use(async function (req,res, next) {
    const scoreData = await Score.find();
    res.locals.scoreData = scoreData;
    next();
})

// GET RATINGS
app.use(async function (req,res, next) {
    if (req.isAuthenticated()) {
        const {ratedFilms} = await Rating.findOne({ 'user': req.user._id }).populate('ratedFilms.rating');
        res.locals.ratedFilms = ratedFilms;
        next();
    } else {
        res.locals.ratedFilms = [];
        next();
    }
})

// GET COLLECTIONS
app.use(async function (req,res, next) {
    if (req.isAuthenticated()) {
        const collections = await Collection.find({'user': req.user._id})
        res.locals.collections = collections;
        next();
    } else {
        res.locals.collections = [];
        next();
    }
})

// #############
// ROUTES
// #############

// REQUIRE ROUTERS
const homeRoutes = require('./routes/home')
const filmRoutes = require('./routes/film')
const collectionsRoutes = require('./routes/collections')
const watchlistRoutes = require('./routes/watchlist')
const ratingRoutes = require('./routes/rating')
const userRoutes = require('./routes/user')

// ROUTES
app.use('/', homeRoutes)
app.use('/film', filmRoutes)
app.use('/collections', collectionsRoutes)
app.use('/watchlist', watchlistRoutes)
app.use('/rating', ratingRoutes)
app.use('/', userRoutes)

// 404 ERROR
app.all('*', function (req,res,next) {
    next(new ExpressError("Page not found", 404))
})

// ERROR HANDLER
app.use(function (err, req, res, next) {
    const {message = "Something went wrong", statusCode = 500} = err;
    console.log(err)
    res.status(statusCode).render('error', {name: `Error ${statusCode}`, statusCode, message})
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})