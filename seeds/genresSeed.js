const mongoose = require('mongoose');
const Genre = require('../models/genre');

mongoose.connect('mongodb://localhost:27017/meliesDB', {useNewUrlParser: true, useUnifiedTopology: true})
.then(function () {
    console.log("CONNECTION OPEN!")
})
.catch(function (err) {
    console.log("OH NO, ERROR!")
    console.log(err)
});

const genresSeed = [
    {id: 28, name: "Action", color: "#6888de"},
    {id: 12, name: "Adventure", color: "#f3a267"},
    {id: 16, name: "Animation", color: "#fdffb6"},
    {id: 35, name: "Comedy", color: "#e2d28d"},
    {id: 80, name: "Crime", color: "#ff6464"},
    {id: 99, name: "Documentary", color: "#a7b8d4"},
    {id: 18, name: "Drama", color: "#51a9ff"},
    {id: 10751, name: "Family", color: "#F4D5D3"},
    {id: 14, name: "Fantasy", color: "#59ffaf"},
    {id: 36, name: "History", color: "#b18c6c"},
    {id: 27, name: "Horror", color: "#06d6a0"},
    {id: 10402, name: "Music", color: "#eabf88"},
    {id: 9648, name: "Mystery", color: "#c999ff"},
    {id: 10749, name: "Romance", color: "#ff7688"},
    {id: 878, name: "Science Fiction", color: "#a88ce0"},
    {id: 53, name: "Thriller", color: "#bce784"},
    {id: 10752, name: "War", color: "#68b76c"},
    {id: 37, name: "Western", color: "#e4bb97"}
]

Genre.insertMany(genresSeed)
.then(res => {console.log(res)})
.catch(err => {console.log(err)})
