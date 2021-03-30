// REQUIRE MONGODB MODELS
const Watchlist = require('../models/watchlist');

module.exports.watchlistPage = async function (req,res,next) {
    const {watchlist} = res.locals;
    res.render('watchlist', {name: "Your Watchlist", watchlist})
};

module.exports.addToWatchlist = async function (req, res,next) {
    if (req.isAuthenticated()) {
        const id = Number(req.body.id);
        const film = req.body;
    
        const watchlistData = await Watchlist.findOne({ 'user': req.user._id });
        const watchlist = watchlistData.watchlist;
        const inWatchlist = watchlist.some(e => e.id === id);
    
        if (!inWatchlist) {
            watchlistData.watchlist.push(film);
            await watchlistData.save();
        }    
        res.sendStatus(200);
    } else {
        res.redirect("/login")
    }
};

module.exports.removeFromWatchlist = async function (req,res,next) {
    const id = Number(req.body.id);

    let watchlistData = await Watchlist.findOne({ 'user': req.user._id });
    const inWatchlist = watchlistData.watchlist.some(e => e.id === id);

    if (inWatchlist) {
        watchlistData.watchlist = watchlistData.watchlist.filter(e => e.id !== id);
        await watchlistData.save();
    }

    res.sendStatus(200);
};