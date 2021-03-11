const mongoose = require('mongoose');
const Collection = require('./models/collection');
const Watchlist = require('./models/watchlist');

mongoose.connect('mongodb://localhost:27017/meliesDB', {useNewUrlParser: true, useUnifiedTopology: true})
.then(function () {
    console.log("CONNECTION OPEN!")
})
.catch(function (err) {
    console.log("OH NO, ERROR!")
    console.log(err)
});

// const seedCollections = [
//     {
//         name: "Collection Blu-Ray",
//         image: "https://images.vice.com/vice/images/content-images/2015/04/09/video-clubs-paris-france-813-body-image-1428577906.jpg?resize=1600:*",
//         color: "#38aecc"
//     },    
//     {
//         name: "Shopping list",
//         image: "https://www2.bfi.org.uk/sites/bfi.org.uk/files/fb-images/blockbuster-video-store-1990s-16x9.jpg",
//         color: "#da4167"
//     },
//     {
//         name: "Favorite films",
//         image: "https://i.guim.co.uk/img/media/21d831ddc3d5e48f405ba4ab93ca7b7953d11019/0_281_3508_2105/master/3508.jpg?width=1200&quality=85&auto=format&fit=max&s=de4d73de9c753f1cb5fbb2439a2dd010",
//         color: "#5cf17a"
//     },
//     {
//         name: "Nanars",
//         image: "https://matchboxcineclub.files.wordpress.com/2018/04/30070477_10103105365651138_1539228525_o.jpg",
//         color: "#fde97d"
//     },
//     {
//         name: "Chefs d'oeuvre à rattraper",
//         image: "https://s.yimg.com/ny/api/res/1.2/SzRY7_jJTZ97_ZtiFBJDLg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTUyMi42NjY2NjY2NjY2NjY2/https://s.yimg.com/os/creatr-uploaded-images/2020-08/bd61a020-dc8e-11ea-9b9e-2065ae046227",
//         color: "#38aecc",
//         filmID: [238, 111]
//     },
//     {
//         name: "Films Netflix à regarder",
//         image: "https://s.yimg.com/ny/api/res/1.2/SzRY7_jJTZ97_ZtiFBJDLg--/YXBwaWQ9aGlnaGxhbmRlcjt3PTk2MDtoPTUyMi42NjY2NjY2NjY2NjY2/https://s.yimg.com/os/creatr-uploaded-images/2020-08/bd61a020-dc8e-11ea-9b9e-2065ae046227",
//         color: "#da4167",
//         filmID: [722913, 641662, 500840]
//     }
// ]


// const watchlistSeed = {
//     user: "elgaga44",
//     watchlist: [424, 1955, 497, 615643, 558582, 502033, 661914, 581734]
// }

// Watchlist.insertMany(watchlistSeed)
// .then(res => {console.log(res)})
// .catch(err => {console.log(err)})

