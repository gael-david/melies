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

// MIDDLEWARES
const validateCollection = function (req,res, next) {
    // SCHEMA VALIDATION
    const collectionSchema = Joi.object({
        name: Joi.string().required().max(50),
        color: Joi.string().required(),
    }).options({ allowUnknown: true });

    const {error} = collectionSchema.validate(req.body)
    const result = collectionSchema.validate(req.body)

    if (error) {
        const msg = error.details.map(element => element.message).join(",")
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', wrapAsync(async function (req,res,next) {
    const collections = await Collection.find({});
    console.log(collections)

    // For each collection, get the first film ID
    const firstFilmID = [];
    collections.forEach(collection => {
        if (collection.filmID[0]) {
            firstFilmID.push(collection.filmID[0])
        }
    });

    // For each first film ID, initialize the API query
    const allPromises = []
    function getFilmDetails(ID) {
        return axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=b8f2293b707b20a0f2b4fe224087f761`);
    }
    firstFilmID.forEach(firstFilm => {
        allPromises.push(getFilmDetails(firstFilm))
    });

    // Launch all API queries
    Promise.all(allPromises)
    .then(async function (results) {
        // Fetch data from all API queries
        const filmData = [];
        for (let index = 0; index < (firstFilmID.length); index++) {
            filmData.push(results[index].data);
        }

        // Get backrop information for each Collection first film
        const filmBackdrop = [];
        filmData.forEach(film => {
            filmBackdrop.push({
                id: film.id,
                backdrop: `https://image.tmdb.org/t/p/w780${film.backdrop_path}`,
            })
        });

        collections.forEach(collection => {
            filmBackdrop.forEach(film => {
                if (collection.filmID[0] == film.id) {
                    collection.image = film.backdrop;
                }
            });
            collection.save();
        });

        res.render('collections/allCollections', {name : "All your Collections", collections, filmBackdrop});
    })
    .catch(function(err) {
        console.log(err.message); // some coding error in handling happened
      });
}))

router.post('/',validateCollection, wrapAsync(async function (req,res,next) {
    const collection = new Collection(req.body);
    await collection.save();

    req.flash('success', 'Collection successfully created!');

    res.redirect('/collections');
}))

router.get('/create', wrapAsync(async function (req,res,next) {
    res.render('collections/newCollection', {name: "Create a new Collection"})
}))

router.get('/:collectionID', wrapAsync(async function (req,res,next) {
    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;

    const {collectionID} = req.params;
    const collections = await Collection.find({});
    const collection = await Collection.findById(collectionID);
    const collectionFilmsID = collection.filmID;
    let allPromises = [];

    function getCollectionFilms(ID) {
        return axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US`);
    }

    collectionFilmsID.forEach(filmID => {
        allPromises.push(getCollectionFilms(filmID))
    });

    Promise.all(allPromises)
    .then(function (results) {       
        const collectionFilms = [];
        for (let index = 0; index < (collectionFilmsID.length); index++) {
            collectionFilms.push(results[index].data);
        }
        console.log(collection)
        res.render('collections/collection', {name : `Collection ${collection.name}`, collection, collectionFilms, collections, watchlist})
    });
}))

router.delete('/:collectionID/delete', wrapAsync(async function (req,res,next) {
    const {collectionID} = req.params;

    await Collection.remove({ '_id': collectionID })

    req.flash('deleted', 'Collection successfully deleted!');

    res.redirect('back');
}))

router.get('/:filmID/add', wrapAsync(async function (req,res,next) {
    const collections = await Collection.find({});
    const filmID = Number(req.params.filmID);
    res.render('collections/saveToCollection', {name: "Add to your Collections", collections, filmID})
}))

router.put('/:filmID/add', wrapAsync(async function (req,res,next) {
    const collectionsData = req.body.collections;
    const {filmID} = req.params;
    const savedCollections = collectionsData.split(',');
    console.log("Saved collections", savedCollections)
    const collections = await Collection.find({});

    // Check if the film is already in some collections
    const doesFilmExist = await Collection.exists({ 'filmID': filmID });
    console.log("Does film exist in some collections:",doesFilmExist)
    // If so, check if it has just been re-added to one of these collections
    if (doesFilmExist === true) {
        collectionsContainingFilm = await Collection.find({'filmID': filmID});
        console.log("Collections containing film:",collectionsContainingFilm)
        console.log(savedCollections)
    // If so, remove this collection from the Mongoose query
        collectionsContainingFilm.forEach(collection => {
            if (savedCollections.includes(String(collection._id))) {
                savedCollections.pop(collection._id)
            }
        });
    }

    await Collection.updateMany({'_id': {'$in': savedCollections}}, {'$push': {
        'filmID': filmID
    }});

    res.redirect(`/film/${filmID}`);
}))

module.exports = router;