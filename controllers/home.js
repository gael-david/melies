// REQUIRE MONGODB MODELS
const Genre = require('../models/genre');
// REQUIRE AXIOS
const axios = require('axios');
// REQUIRE SHUFFLE ARRAY FUNCTION
const {shuffleArray} = require('../utilities/shuffleArray')
// GET DATA FROM "FAKE DB"
const {randomFilmGenre} = require('../public/js/genres');
const {discoverFilmsID} = require('../public/js/discover');

module.exports.homepage = async function (req,res,next) {
    const {watchlist} = res.locals;
    const allFilmGenres = await Genre.find(); 

    const currentUser = res.locals
    console.log(currentUser)
    
    // GET RANDOM GENRE ID
    const filmGenre = randomFilmGenre();
    const genreID = filmGenre.id;

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

    // INIT ALL PROMISES
    let allPromises = [getPopularFilms(), getTopFilms(), getRandomGenreFilms()];

    function getPopularFilms() {
        const randomPage = Math.floor(Math.random() * 5 + 1)
        return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${randomPage}`);
    }

    function getTopFilms() {
        const randomPage = Math.floor(Math.random() * 10 + 1)
        return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${randomPage}&vote_count.gte=2500`);
    }

    async function getRandomGenreFilms() {
        const allGenreFilms = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`)
        // Get random page (except the last one, as it can have only 1 result)
        const randomPage = Math.floor(Math.random() * (allGenreFilms.data.total_pages - 1) + 1);
        return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${randomPage}&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`);
    }

    function getDiscoverFilms(ID) {
        return axios.get(`https://api.themoviedb.org/3/movie/${ID}?api_key=${process.env.API_KEY}&language=en-US`);
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

        shuffleArray(popularFilms.results)
        shuffleArray(topFilms.results)
        shuffleArray(randomGenreFilms.results)
        shuffleArray(discoverFilms)

        res.render('home', {name: "Home page", randomID, popularFilms, topFilms, filmGenre, randomGenreFilms, allFilmGenres, discoverFilms, watchlist });
    })
    .catch(function(err) {
        console.log(err.message); 
    });
};