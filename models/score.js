const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const scoreSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
})

const Score = mongoose.model('Score', scoreSchema);

module.exports = Score;