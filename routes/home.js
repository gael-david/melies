// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE AXIOS
const axios = require('axios');
// REQUIRE COOKIE-PARSER
const cookieParser = require('cookie-parser');
// REQUIRE JOI (SERVER-SIDE SCHEMA VALIDATION)
const Joi = require('joi');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');
const ExpressError = require('../utilities/ExpressError');
// REQUIRE MONGODB MODELS
const Collection = require('../models/collection');
const Watchlist = require('../models/watchlist');
// GET DATA FROM "FAKE DB"
const {randomFilmGenre} = require('../public/js/genres');
const {allFilmGenres} = require('../public/js/genres');
const {discoverFilmsID} = require('../public/js/discover');

router.get('/', wrapAsync(async function (req,res,next) {

    // GET RANDOM GENRE ID
    const filmGenre = randomFilmGenre();
    const genreID = filmGenre.id;

    // GET USER'S WATCHLIST
    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    if (watchlistData && watchlistData.watchlist.length > 0) {
        watchlist = watchlistData.watchlist;
    } else {
        watchlist = [];
    }

    // INIT ALL PROMISES
    let allPromises = [getPopularFilms(), getTopFilms(), getRandomGenreFilms()];

    function getPopularFilms() {
        return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&page=1`);
    }

    function getTopFilms() {
        return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=7500`);
    }

    async function getRandomGenreFilms() {
        let randomPage;
        await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`)
        .then(function (response) {
            randomPage = Math.floor(Math.random() * response.data.total_pages + 1)
        })
        .catch(function (error) {
            console.log(error);
        })

        return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${randomPage}&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`);
    }

    function getDiscoverFilms(ID) {
        return axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US`);
    }

    for (let index = 0; index < discoverFilmsID.length; index++) {
        allPromises.push(getDiscoverFilms(discoverFilmsID[index]))
    }
      
    Promise.all(allPromises)
    .then(async function (results) {
        const popularFilms = results[0].data;
        const topFilms = results[1].data;
        const randomGenreFilms = results[2].data;
        
        const discoverFilms = [];
        for (let index = 3; index < (discoverFilmsID.length + 3); index++) {
            discoverFilms.push(results[index].data);
        }

        res.render('home', {name: "Home page", popularFilms, topFilms, filmGenre, randomGenreFilms, allFilmGenres, discoverFilms, watchlist });
    })
    .catch(function(err) {
        console.log(err.message); 
    });
}))

module.exports = router;