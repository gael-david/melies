const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    user: { 
        type: String,
        // type: Schema.Types.ObjectId, 
        // required: true,
        // ref: 'User' 
    },
    film: [{
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
    }],
    rating: {
        type: String,
        required: true
    },
    review: {
        type: String
    }
})

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;