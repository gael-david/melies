const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const collectionSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'User' 
    },
    name: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    visibility: {
        type: String,
        enum: ["Public", "Private"],
        required: true
    },
    image: {
        type: String,
        default: '/images/collectionDefault.jpeg'
    },
    filmID: [Number]
})

const Collection = mongoose.model('Collection', collectionSchema);

module.exports = Collection;