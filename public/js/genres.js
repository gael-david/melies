const genresList = {
    Action: 28,
    Adventure: 12,
    Animation: 16,
    Comedy: 35,
    Crime: 80,
    Documentary: 99,
    Drama: 18,
    Family: 10751,
    Fantasy: 14,
    History: 36,
    Horror: 27,
    Music: 10402,
    Mystery: 9648,
    Romance: 10749,
    SF: 878,
    Thriller: 53,
    War: 10752,
    Western: 37
};

const allFilmGenres = [
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

module.exports.randomFilmGenre = function () {
    const randomGenreNumber = Math.floor(Math.random() * allFilmGenres.length);
    let filmGenre = allFilmGenres[randomGenreNumber];
    return filmGenre;
}

module.exports.allFilmGenres = allFilmGenres;

module.exports.randomGenre = function() {
    // Create the genre object
    let genre = {name : "", ID : ""}
    // Pick a random genre
    const genreKeys = Object.keys(genresList);
    const randomKeyNumber = Math.floor(Math.random() * genreKeys.length);
    // Store the genre name
    const genreName = genreKeys[randomKeyNumber];
    // Store the genre ID
    const genreID = genresList[genreName];
    // Push everyhting to the genre object
    genre.name = genreName;
    genre.ID = genreID;
    return genre;
};

