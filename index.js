// #############
// CONFIGURATION
// #############

// EXPRESS INIT
const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '/public')))

// MONGOOSE INIT
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/meliesDB', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        console.log("CONNECTION OPEN!")
    })
    .catch(function (err) {
        console.log("OH NO, ERROR!")
        console.log(err)
    })

// EJS CONFIG
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// ENABLE FORM DATA PARSING & OTHER HTTP METHODS (DELETE, PATCH)
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// REQUIRE COOKIE-PARSER
const cookieParser = require('cookie-parser');

// REQUIRE & CONFIG FLASH
const flash = require('connect-flash')
app.use(flash())

// REQUIRE & CONFIG EXPRESS-SESSION
const session = require('express-session');
const sessionConfig = {
    secret: 'passwordtochange!',
    resave: false,
    saveUninitialize: true,
    cookie: {
        HttpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24
    }
}
app.use(session(sessionConfig));

// REQUIRE UTILITIES
const ExpressError = require('./utilities/ExpressError');

// #############
// MIDDLEWARES
// #############

// FLASH MIDDLEWARE
app.use(function(req, res, next) {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.deleted = req.flash('deleted');
    res.locals.loggedin = req.flash('loggedin');
    next();
})

// REQUIRE ROUTERS
const homeRoutes = require('./routes/home')
const filmRoutes = require('./routes/film')
const collectionsRoutes = require('./routes/collections')
const watchlistRoutes = require('./routes/watchlist')
const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login');

// ROUTES
app.use('/', homeRoutes)
app.use('/film', filmRoutes)
app.use('/collections', collectionsRoutes)
app.use('/watchlist', watchlistRoutes)
app.use('/signup', signupRoutes)
app.use('/login', loginRoutes)

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

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})