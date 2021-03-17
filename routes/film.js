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

router.get('/search', wrapAsync(async function (req,res,next) {
    const {q} = req.query;
    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;

    const filmQuery = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&query=${q}&page=1&include_adult=false`)
    const searchedFilms = filmQuery.data;

    res.render('search', {q, searchedFilms, name: `Search results for ${q}`, watchlist});
}));

router.get('/:filmID', wrapAsync(async function (req,res,next) {
    const filmID = Number(req.params.filmID);
    const collections = await Collection.find({});
    // const watchlistData = await Watchlist.findById("6027e426510bab273adfb29c");
    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;

    // Check if film is in user's watchlist
    const inWatchlist = watchlist.some(e => e.id === filmID)

    // Check if film is in at least one Collection
    const inCollection = collections.some(collection => collection.filmID.includes(filmID));

    let lang;
    if (req.headers["accept-language"].slice(0,5) == "fr-FR" || "fr-fr") {lang = "en-US";} else {lang = "en-US";}

    function getFilmDetails() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}?api_key=b8f2293b707b20a0f2b4fe224087f761&language=${lang}`);
    }
    function getFilmProviders() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/watch/providers?api_key=b8f2293b707b20a0f2b4fe224087f761&language=${lang}`);
    } 
    function getFilmCredits() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=b8f2293b707b20a0f2b4fe224087f761&language=${lang}`);
    }
    function getFilmVideos() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=b8f2293b707b20a0f2b4fe224087f761&language=${lang}`);
    }
    function getFilmRecommendations() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/recommendations?api_key=b8f2293b707b20a0f2b4fe224087f761&language=${lang}`);
    }

    Promise.all([getFilmDetails(), getFilmProviders(), getFilmCredits(), getFilmVideos(), getFilmRecommendations()])
    .then(function (results) {
        const filmData = results[0].data;
        const filmProviders = results[1].data;
        const filmCredits = results[2].data;
        const filmVideos = results[3].data;
        const filmRecommendations = results[4].data;
        res.render("film", {allFilmGenres, filmID, filmData, filmProviders, filmCredits, filmVideos, filmRecommendations, name: filmData.title, watchlist, collections, inCollection, inWatchlist});
    });
}));

router.delete('/:filmID/remove', wrapAsync(async function (req,res,next) {
    const {filmID} = req.params;
    const {collectionID} = req.body;
    console.log(filmID, collectionID)
    await Collection.updateOne({ '_id': collectionID },{ $pull: { 'filmID': filmID } });

    res.redirect('back');
}))

router.get('/genre/:genreID/:genrePage', wrapAsync(async function (req,res,next) {
    const {genreID} = req.params;
    const {genrePage} = req.params;
    const genreName = allFilmGenres.find(genre => genre.id == genreID).name;

    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;

    const genreQuery = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${genrePage}&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`)
    const genreFilms = genreQuery.data;
    
    res.render('genre', {genreID, genrePage, genreName, genreFilms, allFilmGenres, name: `Top ${genreName} films - Page ${genrePage}`, watchlist});
}))

module.exports = router;