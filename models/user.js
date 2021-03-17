const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const watchlistSchema = new Schema({
    user: { 
        type: String,
        // type: Schema.Types.ObjectId, 
        // ref: 'User' 
    },
    email: {
        type: Email
    },
    password: {
        type: Password,
    },
    watchlist: [{
        type: Schema.Types.ObjectId, 
        ref: 'Watchlist'
    }]
})

const User = mongoose.model('User', userSchema);

module.exports = User;