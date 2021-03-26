const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const genreSchema = new Schema({
    id: {
        type: Number,
        required: true
    }, 
    name: {
        type: String,
        required: true
    }, 
    color: {
        type: String,
        required: true
    }
})

const Genre = mongoose.model('Genre', genreSchema);

module.exports = Genre;