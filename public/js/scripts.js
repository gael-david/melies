// ################
// MAINTAIN POSITION AFTER RELOAD
// ################

// window.addEventListener('scroll',function() {
//     //When scroll change, you save it on localStorage.
//     localStorage.setItem('scrollPosition',window.scrollY);
// },false);

// window.addEventListener('load',function() {
//     if(localStorage.getItem('scrollPosition') !== null)
//        window.scrollTo(0, localStorage.getItem('scrollPosition'));
// },false);

// ################
// WATCHLIST
// ################

const addWatchlistButtons = document.querySelectorAll('#addWatchlistButton');

addWatchlistButtons.forEach(button => {
    button.addEventListener("click", async function () {
        const title = button.dataset.title;
        const id = button.dataset.id;
        const release_date = button.dataset.release;
        const poster_path = button.dataset.poster;
        const film = {title, id, release_date, poster_path}

        try {
            const response = await axios({
                method: 'put',
                url: '/watchlist',
                data: film
            });
            console.log(response)
        } catch (error) {
            console.log(error)
        }

        button.setAttribute("id", removeWatchlistButton);
        button.querySelector(".material-icons").classList.add("favorite");
        button.querySelector(".material-icons").innerHTML = "bookmark_added";
    })
});

const removeWatchlistButtons = document.querySelectorAll('#removeWatchlistButton');

removeWatchlistButtons.forEach(button => {
    button.addEventListener("click", async function () {
        const title = button.dataset.title;
        const id = button.dataset.id;
        const release_date = button.dataset.release;
        const poster_path = button.dataset.poster;
        const film = {title, id, release_date, poster_path}

        try {
            const response = await axios({
                method: 'delete',
                url: '/watchlist',
                data: film
            });   
            console.log(response)
        } catch (error) {
            console.log(error)
        }

        button.setAttribute("id", addWatchlistButton);
        button.querySelector(".material-icons").classList.remove("favorite");
        button.querySelector(".material-icons").innerHTML = "bookmark_border";
    })
});


// ################
// COLLECTIONS
// ################

const body = document.body;
const createCollection = document.getElementById('createCollection');
const addCollectionButton = document.getElementById('addCollectionButton');
const cancelButton = document.getElementById('cancelButton');
const saveToCollectionButton = document.getElementById('saveToCollectionButton');
const formComponent = document.querySelector('.formComponent');
const collectionSelector = document.querySelectorAll('.collectionSelector');
const overlay = document.querySelector('.overlay');

let collectionChoice = [];

// ADD FILM TO COLLECTION(S) (DISPLAY FORM)
if (addCollectionButton) {
    addCollectionButton.addEventListener("click", function () {
        overlay.classList.toggle("visible");
        collectionForm.classList.toggle("visible");
        body.classList.toggle("openModal");
    })  
}

// SELECT COLLECTIONS FOR THE FILM
if (collectionSelector) {
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

// // CANCEL BUTTON
// if (cancelButton) {
//     cancelButton.addEventListener("click", function () {
//         overlay.classList.toggle("visible");
//         collectionForm.classList.toggle("visible");
//         body.classList.toggle("openModal");
//     })
// }

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


