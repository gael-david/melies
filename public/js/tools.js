module.exports = {
    filmDetails: function getFilmDetails() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}?api_key=${process.env.API_KEY}&language=en-US`);
    },
    filmCredits: function getFilmCredits() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/credits?api_key=${process.env.API_KEY}&language=en-US`);
    },
    filmVideos: function getFilmVideos() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${process.env.API_KEY}&language=en-US`);
    },
    filmRecommendations: function getFilmVideos() {
        return axios.get(`https://api.themoviedb.org/3/movie/${filmID}/videos?api_key=${process.env.API_KEY}&language=en-US`);
    }
  };