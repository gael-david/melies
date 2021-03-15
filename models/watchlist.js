const mongoose = require('mongoose');

// const watchlistSchema = new mongoose.Schema({
//     // user: { 
//     //     type: Schema.Types.ObjectId, 
//     //     required: true,
//     //     ref: 'User' 
//     // },
//     watchlist: [Number]
// })

const watchlistSchema = new mongoose.Schema({
    user: { 
        type: String,
        // type: Schema.Types.ObjectId, 
        // ref: 'User' 
    },
    watchlist: [{
        id: {
            type: Number,
            required: true
        },
        title : {
            type: String,
            required: true
        },
        release_date : {
            type: String,
        },
        poster_path : {
            type: String,
            default: '/images/noposter.jpeg'
        }
    }]
})

const Watchlist = mongoose.model('Watchlist', watchlistSchema);

module.exports = Watchlist;