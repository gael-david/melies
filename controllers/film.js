// REQUIRE MONGODB MODELS
const Genre = require('../models/genre');
// REQUIRE AXIOS
const axios = require('axios');

module.exports.search = async function (req,res,next) {
    const {q} = req.query;
    const filmQuery = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.API_KEY}&language=en-US&query=${q}&page=1&include_adult=false`)
    const searchedFilms = filmQuery.data;

    res.render('search', {q, searchedFilms, name: `Search results for ${q}`});
};

module.exports.page = async function (req,res,next) {
    const filmID = Number(req.params.filmID);
    const {collections} = res.locals;
    const {watchlist} = res.locals;
    const allFilmGenres = await Genre.find(); 

    // Get a random film ID
    async function getRandomID() {
        const films = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-EN&vote_average.gte=6&vote_count.gte=100`)
        const allPages = films.data.total_pages;
        const randomPage = `${Math.floor(Math.random() * allPages + 1)}`;
        const pageFilms = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-EN&vote_average.gte=6&vote_count.gte=100&page=${randomPage}`)
        return pageFilms.data.results[Math.floor(Math.random() * pageFilms.data.results.length)].id;
        // return randomID
    } 
    const randomID = await getRandomID();

    // Check if film is in user's watchlist
    const inWatchlist = watchlist.some(e => e.id === filmID)

    // Check if film is in at least one Collection
    const inCollection = collections.some(collection => collection.filmID.includes(filmID));

    function getFilmDetails() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY}&language=en-US`);
    }
    function getFilmProviders() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/watch/providers?api_key=${process.env.API_KEY}&language=en-US`);
    } 
    function getFilmCredits() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY}&language=en-US`);
    }
    function getFilmVideos() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${process.env.API_KEY}&language=en-US`);
    }
    function getFilmRecommendations() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/recommendations?api_key=${process.env.API_KEY}&language=en-US`);
    }

    Promise.all([getFilmDetails(), getFilmProviders(), getFilmCredits(), getFilmVideos(), getFilmRecommendations()])
    .then(function (results) {
        const filmData = results[0].data;
        const filmProviders = results[1].data;
        const filmCredits = results[2].data;
        const filmVideos = results[3].data;
        const filmRecommendations = results[4].data;

        res.render("film", {allFilmGenres, filmID, filmData, filmProviders, filmCredits, filmVideos, filmRecommendations, randomID, name: filmData.title, inCollection, inWatchlist});
    });
};

module.exports.genre = async function (req,res,next) {
    const {genreID, genrePage} = req.params;
    const allFilmGenres = await Genre.find();
    
    const genre = await Genre.findOne({id: genreID});
    
    const genreQuery = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${genrePage}&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`)
    const genreFilms = genreQuery.data;

    const totalPages = genreFilms.total_pages;

    res.render('genre', {genreID, genrePage, totalPages, genre, genreFilms, allFilmGenres, name: `Top ${genre.name} films - Page ${genrePage}`});
};