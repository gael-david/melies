// ################
// COLLECTIONS
// ################

const body = document.body;
const createCollection = document.getElementById('createCollection');
const addCollectionButton = document.getElementById('addCollectionButton');
const cancelButton = document.getElementById('cancelButton');
const saveToCollectionButton = document.getElementById('saveToCollectionButton');
const collectionForm = document.querySelector('.collectionForm');
const collectionSelector = document.querySelectorAll('.collectionSelector');
const overlay = document.querySelector('.overlay');

let collectionChoice = [];

// CREATE NEW COLLECTION (DISPLAY THE FORM)
if (createCollection) {
    createCollection.addEventListener("click", function () {
        overlay.classList.toggle("visible");
        collectionForm.classList.toggle("visible");
        body.classList.toggle("openModal");
    })
}

// ADD FILM TO COLLECTION(S) (DISPLAY FORM)
if (addCollectionButton) {
    addCollectionButton.addEventListener("click", function () {
        overlay.classList.toggle("visible");
        collectionForm.classList.toggle("visible");
        body.classList.toggle("openModal");
    })  
}

// SELECT COLLECTIONS FOR THE FILM
if (addCollectionButton) {
    collectionSelector.forEach(collection => {
        collection.addEventListener("click", function () {
            this.classList.toggle("selected");
            // Push selected collections to array
            if (this.classList.contains("selected")) {
                collectionChoice.push(this.dataset.collectionId);
            } else {
                collectionChoice.pop(this.dataset.collectionId);
            }
            saveToCollectionButton.value = collectionChoice;
        })
    });
}

// ADD FILM TO THESE COLLECTIONS (VIA MONGOOSE)
if (saveToCollectionButton) {
    saveToCollectionButton.addEventListener("click", () => {
        saveToCollectionButton.value = collectionChoice;
    })
}

// CANCEL BUTTON
if (cancelButton) {
    cancelButton.addEventListener("click", function () {
        overlay.classList.toggle("visible");
        collectionForm.classList.toggle("visible");
        body.classList.toggle("openModal");
    })
}

// ################
// WATCHLIST BUTTON
// ################

const addWatchlistForm = document.getElementById('addWatchlistForm');
const removeWatchlistForm = document.getElementById('removeWatchlistForm');

// addWatchlistForm.addEventListener('click', function () {
//     addWatchlistForm.style.display = "None";
//     removeWatchlistForm.style.display = "Flex";
// })

// removeWatchlistForm.addEventListener('click', function () {
//     removeWatchlistForm.style.display = "None";
//     addWatchlistForm.style.display = "Flex";
// })

// ################
// RATING BUTTON
// ################

const ratingWrapper = document.querySelectorAll('.ratingWrapper');
const ratingButton = document.querySelectorAll('.ratingButton');
const ratingComponent = document.querySelectorAll('.ratingComponent');


// ratingButton.addEventListener('click', function () {
//     ratingButton.classList.remove("userRating");
//     if (ratingWrapper.style.display == "none") {
//         ratingWrapper.style.display = "flex";
//     } else {
//         ratingWrapper.style.display = "none";
//     }
// })

ratingButton.forEach(button => {
    button.addEventListener('click', function () {
        button.classList.remove("userRating");
        if (button.parentNode.querySelector(".ratingWrapper").style.display == "none") {
            ratingWrapper.forEach(wrapper => {
                console.log("deleting")
                wrapper.style.display = "none";
            });
            button.parentNode.querySelector(".ratingWrapper").style.display = "flex";
        } else {
            button.parentNode.querySelector(".ratingWrapper").style.display = "none";
        }
    })
}); 

// ratingComponent.forEach(component => {
//     component.addEventListener("click", function () {
//         ratingButton.innerText = component.dataset.img;
//         ratingButton.classList.add("userRating");
//     })
// });

ratingComponent.forEach(component => {
    component.addEventListener("click", function () {
        component.parentNode.parentNode.querySelector(".ratingButton").innerText = component.dataset.img;
        component.parentNode.parentNode.querySelector(".ratingButton").classList.add("userRating");
    })
});

// document.body.addEventListener('click', function (event) {
//     let isClickInside = ratingButton.contains(event.target);
//     if (!isClickInside) {
//         ratingWrapper.style.display = "none";
//     } 
// })

document.body.addEventListener('click', function (event) {
    console.log(event.target.classList[0])
    if (!(event.target.classList[0] == "ratingButton" || event.target.innerText == "grade")) {
        ratingWrapper.forEach(wrapper => {
            wrapper.style.display = "none";
        });
        
    } 
})

// ratingWrapper.addEventListener('mouseover', function () {
//     clearTimeout(wrapperTimeout)
//     ratingWrapper.style.display = "Flex";
// })

// ratingButton.addEventListener('mouseover', function () {
//     if (ratingWrapper.style.display == "none") {
//         ratingWrapper.style.display = "flex";
//     } else {
//         ratingWrapper.style.display = "none";
//     }
// })

// ratingButton.addEventListener('mouseleave', function () {
//     wrapperTimeout = setTimeout(function(){ ratingWrapper.style.display = "None"; }, 500);
// })  

// ratingWrapper.addEventListener('mouseleave', function () {
//     wrapperTimeout = setTimeout(function(){ ratingWrapper.style.display = "None"; }, 500);
// }) 

// ################
// RANDOM FILM BUTTON
// ################

const anotherButton = document.getElementById('anotherButton');
const randomButton = document.getElementById('randomButton');
let randomID;

getRandomID ();

async function getRandomID () {
    axios.get('https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-EN&vote_average.gte=6&vote_count.gte=100')
	.then(async function (response) {
        allFilms = await response.data;
        allPages = await allFilms.total_pages;
        randomPage = `${Math.floor(Math.random() * allPages + 1)}`;
        axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=b8f2293b707b20a0f2b4fe224087f761&language=en-EN&vote_average.gte=6&vote_count.gte=100&page=${randomPage}`)
        .then(async function (response) {
            console.log(response.data);
            randomID = await response.data.results[Math.floor(Math.random() * response.data.results.length)].id;
            if (anotherButton) {
                anotherButton.href = `/film/${await randomID}`;
            }
            if (randomButton) {
                randomButton.href = `/film/${await randomID}`;
            }
        })
        .catch(function (error) {
        console.log("OH NO! SECOND CALL DID NOT WORK", error)
        })
	})
	.catch(function (error) {
	console.log("OH NO!", error)
    })
} 

