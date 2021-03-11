const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema({
    // user: {
    //     type: String,
    //     required: true
    // },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String
    },
    color: {
        type: String,
        required: true
    },
    filmID: [Number]
})

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;