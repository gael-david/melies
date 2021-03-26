// REQUIRE AXIOS
const axios = require('axios');
// REQUIRE SHUFFLE ARRAY FUNCTION
const {shuffleArray} = require('../utilities/shuffleArray')
console.log(shuffleArray)
// GET DATA FROM "FAKE DB"
const {randomFilmGenre} = require('../public/js/genres');
const {allFilmGenres} = require('../public/js/genres');
const {discoverFilmsID} = require('../public/js/discover');

module.exports.homepage = async function (req,res,next) {
    const {watchlist} = res.locals;
    
    // GET RANDOM GENRE ID
    const filmGenre = randomFilmGenre();
    const genreID = filmGenre.id;

    // INIT ALL PROMISES
    let allPromises = [getPopularFilms(), getTopFilms(), getRandomGenreFilms()];

    function getPopularFilms() {
        const randomPage = Math.floor(Math.random() * 5 + 1)
        return axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${process.env.API_KEY}&language=en-US&page=${randomPage}`);
    }

    function getTopFilms() {
        const randomPage = Math.floor(Math.random() * 10 + 1)
        return axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=${randomPage}&vote_count.gte=7500`);
    }

    async function getRandomGenreFilms() {
        const allGenreFilms = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.API_KEY}&language=en-US&sort_by=vote_average.desc&include_adult=false&include_video=false&page=1&vote_count.gte=500&vote_average.gte=7&with_genres=${genreID}`)
        const randomPage = Math.floor(Math.random() * allGenreFilms.data.total_pages + 1)
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

        res.render('home', {name: "Home page", popularFilms, topFilms, filmGenre, randomGenreFilms, allFilmGenres, discoverFilms, watchlist });
    })
    .catch(function(err) {
        console.log(err.message); 
    });
};