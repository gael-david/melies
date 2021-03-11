const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
    user: {
        type: String
    },
    watchlist: [Number]
})

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;