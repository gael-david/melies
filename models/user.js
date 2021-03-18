const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    }
    // watchlist: [{
    //     type: Schema.Types.ObjectId, 
    //     ref: 'Watchlist'
    // }],
})

userSchema.plugin(passportLocalMongoose, { usernameField : 'email' });

const User = mongoose.model('User', userSchema);

module.exports = User;