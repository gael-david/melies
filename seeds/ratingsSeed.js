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
const Rating = require('../models/rating');   
const User = require('../models/user');   

seedUserRatings();

async function seedUserRatings() {
    const allUsers = await User.find();
    let ratingData = [];
    allUsers.forEach(user => {
        ratingData.push({
            user: user._id
        })
    });
    const res = await Rating.insertMany(ratingData);
    console.log(res);
};

// Rating.insertMany(ratingsSeed)
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)})