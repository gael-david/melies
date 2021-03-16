// EXPRESS INIT
const express = require("express");
const app = express();
const path = require('path');
app.use(express.static(path.join(__dirname, '/public')))

// AXIOS INIT
const axios = require('axios');

// JOI INIT (SCHEMA VALIDATION)
const Joi = require('joi');

// MONGOOSE INIT
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/meliesDB', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        console.log("CONNECTION OPEN!")
    })
    .catch(function (err) {
        console.log("OH NO, ERROR!")
        console.log(err)
    })

// EJS CONFIG
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// ENABLE FORM DATA PARSING + OTHER HTTP METHODS (DELETE, PATCH)
const methodOverride = require('method-override')
const bodyParser = require('body-parser')
app.use(methodOverride('_method'))
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// GET DATA FROM "FAKE DB"
const {randomFilmGenre} = require('./public/js/genres');
const {allFilmGenres} = require('./public/js/genres');
const {discoverFilmsID} = require('./public/js/discover');

// GET MODELS FROM MONGODB
const Collection = require('./models/collection');
const Watchlist = require('./models/watchlist');

// GET UTILITIES
const wrapAsync = require('./utilities/wrapAsync');
const ExpressError = require('./utilities/ExpressError');

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

// ROUTES
app.get('/', wrapAsync(async function (req,res,next) {

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
        console.log(watchlist)
        res.render('home', {name: "Home page", popularFilms, topFilms, filmGenre, randomGenreFilms, allFilmGenres, discoverFilms, watchlist });
    })
    .catch(function(err) {
        console.log(err.message); 
    });
}))

app.get('/signup', wrapAsync(async function (req,res,next) {
    res.render("./user/signup", {name: "Sign up - MELIES"})
}))

app.post('/signup', wrapAsync(async function (req,res,next) {
    res.redirect("/")
}))

app.get('/login', wrapAsync(async function (req,res,next) {
    res.render("./user/login", {name: "Login - MELIES"})
}))

app.get('/collections', wrapAsync(async function (req,res,next) {
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

app.post('/collections',validateCollection, wrapAsync(async function (req,res,next) {
    // ADDING COLLECTION TO MONGODB
    const collection = await new Collection(req.body);
    await collection.save();

    res.redirect('/collections');
}))

app.get('/collections/create', wrapAsync(async function (req,res,next) {
    res.render('collections/newCollection', {name: "Create a new Collection"})
}))

app.get('/collections/:collectionID', wrapAsync(async function (req,res,next) {
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

app.delete('/collections/:collectionID/delete', wrapAsync(async function (req,res,next) {
    const {collectionID} = req.params;

    await Collection.remove({ '_id': collectionID })

    res.redirect('back');
}))

app.put('/watchlist', wrapAsync(async function (req, res,next) {
    const id = Number(req.body.id);
    const film = req.body;

    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;
    const inWatchlist = watchlist.some(e => e.id === id);

    if (!inWatchlist) {
        watchlistData.watchlist.push(film);
        await watchlistData.save();
    }

    res.redirect('back');
}))

app.delete('/watchlist', wrapAsync(async function (req,res,next) {
    const id = Number(req.body.id);
    const film = req.body;

    let watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const inWatchlist = watchlistData.watchlist.some(e => e.id === id);

    if (inWatchlist) {
        watchlistData.watchlist = watchlistData.watchlist.filter(e => e.id !== id);
        await watchlistData.save();
    }
    res.redirect('back');
}))

app.get('/film/:filmID', wrapAsync(async function (req,res,next) {
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

app.get('/film/:filmID/add', wrapAsync(async function (req,res,next) {
    const collections = await Collection.find({});
    const filmID = Number(req.params.filmID);
    res.render('collections/saveToCollection', {name: "Add to your Collections", collections, filmID})
}))

app.put('/film/:filmID/add', wrapAsync(async function (req,res,next) {
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

app.delete('/film/:filmID/remove', wrapAsync(async function (req,res,next) {
    const {filmID} = req.params;
    const {collectionID} = req.body;
    console.log(filmID, collectionID)
    await Collection.updateOne({ '_id': collectionID },{ $pull: { 'filmID': filmID } });

    res.redirect('back');
}))

app.get('/film/genre/:genreID/:genrePage', wrapAsync(async function (req,res,next) {
    const {genreID} = req.params;
    const {genrePage} = req.params;
    const genreName = allFilmGenres.find(genre => genre.id == genreID).name;

    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;

    const genreQuery = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${genrePage}&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`)
    const genreFilms = genreQuery.data;
    
    res.render('genre', {genreID, genrePage, genreName, genreFilms, allFilmGenres, name: `Top ${genreName} films - Page ${genrePage}`, watchlist});
}))

app.get('/search', wrapAsync(async function (req,res,next) {
    const {q} = req.query;
    const watchlistData = await Watchlist.findOne({ 'user': "elgaga44" });
    const watchlist = watchlistData.watchlist;

    const filmQuery = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-US&query=${q}&page=1&include_adult=false`)
    const searchedFilms = filmQuery.data;

    res.render('search', {q, searchedFilms, name: `Search results for ${q}`, watchlist});
}));

// 404 ERROR
app.all('*', function (req,res,next) {
    next(new ExpressError("Page not found", 404))
})

// ERROR HANDLER
app.use(function (err, req, res, next) {
    const {message = "Something went wrong", statusCode = 500} = err;
    console.log(err)
    res.status(statusCode).render('error', {name: `Error ${statusCode}`, statusCode, message})
})

app.listen(3000, () => {
    console.log("LISTENING ON PORT 3000");
})