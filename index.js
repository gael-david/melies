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

// REQUIRE UTILITIES
const ExpressError = require('./utilities/ExpressError');

// REQUIRE ROUTERS
const homeRoutes = require('./routes/home')
const filmRoutes = require('./routes/film')
const collectionsRoutes = require('./routes/collections')
const watchlistRoutes = require('./routes/watchlist')
const signupRoutes = require('./routes/signup')
const loginRoutes = require('./routes/login')

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