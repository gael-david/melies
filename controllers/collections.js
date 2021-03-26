// REQUIRE MONGODB MODELS
const Collection = require('../models/collection');
// REQUIRE AXIOS
const axios = require('axios');

module.exports.userCollections = async function (req,res,next) {
    const {collections} = res.locals;

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
        return axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=${process.env.API_KEY}`);
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

        res.render('collections/allCollections', {name : "All your Collections", filmBackdrop});
    })
    .catch(function(err) {
        console.log(err.message); // some coding error in handling happened
      });
};

module.exports.createCollection = async function (req,res,next) {
    // Create collection
    const newCollection = req.body;
    const collection = new Collection(newCollection);
    collection.user = req.user._id;
    await collection.save();

    req.flash('success', 'Collection successfully created!');
    res.redirect('/collections');
};

module.exports.createCollectionForm = async function (req,res,next) {
    res.render('collections/newCollection', {name: "Create a new Collection"})
};

module.exports.collectionPage = async function (req,res,next) {
    const {collectionID} = req.params;
    const collection = await Collection.findById(collectionID);
    const collectionFilmsID = collection.filmID;
    
    let allPromises = [];
    function getCollectionFilms(ID) {
        return axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=${process.env.API_KEY}&language=en-US`);
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
        res.render('collections/collection', {name : `Collection ${collection.name}`, collection, collectionFilms})
    });
};

module.exports.deleteCollection = async function (req,res,next) {
    const {collectionID} = req.params;

    await Collection.remove({ '_id': collectionID })

    req.flash('success', 'Collection successfully deleted!');

    res.redirect('back');
};

module.exports.addToCollectionForm = async function (req,res,next) {
    const filmID = Number(req.params.filmID);
    res.render('collections/saveToCollection', {name: "Add to your Collections", filmID})
};

module.exports.addToCollection = async function (req,res,next) {
    const collectionsData = req.body.collections;
    const {filmID} = req.params;
    const savedCollections = collectionsData.split(',');
    console.log("Saved collections", savedCollections)

    // Check if the film is already in some collections
    const doesFilmExist = await Collection.exists({ 'filmID': filmID });
    console.log("Does film exist in some collections:", doesFilmExist)
    // If so, check if it has just been re-added to one of these collections
    if (doesFilmExist === true) {
        collectionsContainingFilm = await Collection.find({'filmID': filmID});
        console.log("Collections containing film:", collectionsContainingFilm)
        console.log(savedCollections)
    // If so, remove this collection from the Mongoose query
        collectionsContainingFilm.forEach(collection => {
            if (savedCollections.includes(String(collection._id))) {
                savedCollections.pop(collection._id)
            }
        });
    }

    await Collection.updateMany({'_id': {'$in': savedCollections}}, {'$push': {'filmID': filmID}});

    res.redirect(`/film/${filmID}`);
};

module.exports.removeFromCollection = async function (req,res,next) {
    const {filmID} = req.params;
    const {collectionID} = req.body;
    console.log(filmID, collectionID)
    await Collection.updateOne({ '_id': collectionID },{ $pull: { 'filmID': filmID } });

    res.redirect('back');
}