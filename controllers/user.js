// REQUIRE MONGODB MODELS
const Watchlist = require('../models/watchlist');
const User = require('../models/user');

module.exports.signupPage = async function (req,res,next) {
    res.render("./user/signup", {name: "Sign up - MELIES"})
};

module.exports.signup = async function (req,res,next) {
    try {
        // Create user
        const {username, email, password} = req.body;
        const user = new User({email, username});
        const registeredUser = await User.register(user, password);

        // Create user Watchlist
        const watchlist = new Watchlist({user: registeredUser._id});
        await watchlist.save();

        req.login(registeredUser, err => {if (err) return next(err);})
        req.flash('success', 'Welcome to Melies!')
        res.redirect("/");
    } catch (error) {
        req.flash('error', error.message)
        console.log(error)
        res.redirect("/signup");
    }
};

module.exports.loginPage = async function (req,res,next) {
    res.render("./user/login", {name: "Login - MELIES"})
};

module.exports.login = async function (req,res,next) {
    req.flash('success', 'Successfully logged in!');

    const redirectURL = req.session.returnTo || '/';
    delete req.session.returnTo
    res.redirect(redirectURL)
};

module.exports.logout = async function (req,res,next) {
    if (!req.isAuthenticated()) {
        return res.redirect('/');
    } else {
        req.logout();
        req.flash('success', 'Successfully logged out');
        res.redirect('/');
    }
};