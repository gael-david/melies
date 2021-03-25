// REQUIRE MONGODB MODELS
const Collection = require('./models/collection');
const Watchlist = require('./models/watchlist');
const User = require('./models/user');

// REQUIRE JOI (SERVER-SIDE SCHEMA VALIDATION)
const Joi = require('joi');

// CHECK IF USER IS LOGGED IN
module.exports.isLoggedIn = function (req,res,next) {
    if (!req.isAuthenticated()) {
        // Store the URL the user tried to reach
        req.session.returnTo = req.originalUrl;
        
        req.flash('error', 'You must login first');
        return res.redirect('/login');
    } else {
        next();
    }
}

// CHECK IF NEW COLLECTION IS VALID
module.exports.validateCollection = function (req,res, next) {
    // SCHEMA VALIDATION
    const collectionSchema = Joi.object({
        name: Joi.string().required().max(50),
        color: Joi.string().required(),
        visibility: Joi.string().required()
    }).options({ allowUnknown: true });

    const {error} = collectionSchema.validate(req.body)
    const result = collectionSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(element => element.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}