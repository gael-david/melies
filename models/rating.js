const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ratingSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    },
    ratedFilms: [{
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
        },
        rating: {
            type: Schema.Types.ObjectId, 
            required: true,
            ref: 'Score' 
        }
    }]
})

const Rating = mongoose.model('Rating', ratingSchema);

module.exports = Rating;