// REQUIRE UTILITIES
const ExpressError = require('./utilities/ExpressError');

// ##########################
// GENERAL MIDDLEWARES
// ##########################

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

// ##########################
// JOI MIDDLEWARES
// ##########################

// REQUIRE JOI (SERVER-SIDE SCHEMA VALIDATION)
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

// CREATE JOI EXTENSION FOR HTML SANITIZING
const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

// EXTENDED JOI IS NOW DEFAULT 
const Joi = BaseJoi.extend(extension)

// CHECK IF NEW COLLECTION IS VALID
module.exports.validateCollection = function (req,res, next) {
    // SCHEMA VALIDATION
    const collectionSchema = Joi.object({
        name: Joi.string().required().max(50).escapeHTML(),
        color: Joi.string().required(),
        visibility: Joi.string().required(),
        description: Joi.string().optional().allow('').escapeHTML()
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