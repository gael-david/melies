// REQUIRE ENV
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// MONGOOSE INIT
const mongoose = require('mongoose');
const dbURL = process.env.DB_URL || 'mongodb://localhost:27017/meliesDB';

mongoose.connect(dbURL, {useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        console.log("CONNECTION OPEN!")
    })
    .catch(function (err) {
        console.log("OH NO, ERROR!")
        console.log(err)
    })

// REQUIRE MONGODB MODELS
const Score = require('../models/score');    

const scoresSeed = [
    {name: "Masterpiece", symbol: "🍾", rating: "5"},
    {name: "Excellent", symbol: "👏", rating: "4"},
    {name: "Good", symbol: "👍", rating: "3"},
    {name: "Decent", symbol: "🤷‍♀️", rating: "2"},
    {name: "Bad", symbol: "👎", rating: "1"},
    {name: "Nanar", symbol: "💸", rating: "0"},
]

Score.insertMany(scoresSeed)
.then(res => {console.log(res)})
.catch(err => {console.log(err)})
