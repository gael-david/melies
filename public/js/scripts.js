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
// HEADER
// ################

const userComponent = document.querySelector('.userComponent');
const userDropdown = document.querySelector('.userDropdown');
let timer;

if (userComponent) {
    userComponent.addEventListener('click', function () {
        // clearTimeout(timer)
        // userDropdown.style.display = "grid";
        userDropdown.classList.toggle("displayDropdown")
    })
}


// userDropdown.addEventListener('mouseenter', function () {
//     clearTimeout(timer)
//     userDropdown.style.display = "grid";
// })


// userComponent.addEventListener('mouseleave', function () {
//     timer = setTimeout(() => {
//         userDropdown.style.display = "None";
//     }, 500);
// })



// ################
// WATCHLIST
// ################

const watchlistButtons = document.getElementsByClassName('watchlistButton');

for (const button of watchlistButtons) {
    button.addEventListener("click", async function () {
        if (button.classList.contains("addWatchlistButton")) {
            const {id, title, release_date, poster_path} = button.dataset;
            const film = {title, id, release_date, poster_path};

            console.log("Added")
            button.classList.remove("addWatchlistButton");
            button.classList.add("removeWatchlistButton");
            button.querySelector(".material-icons").classList.add("favorite");
            button.querySelector(".material-icons").innerHTML = "bookmark_added";

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
                
        } else if (button.classList.contains("removeWatchlistButton")) {
            const {id, title, release_date, poster_path} = button.dataset;
            const film = {title, id, release_date, poster_path};

            console.log("Removed")
            button.classList.remove("removeWatchlistButton");
            button.classList.add("addWatchlistButton");
            button.querySelector(".material-icons").classList.remove("favorite");
            button.querySelector(".material-icons").innerHTML = "bookmark_border";
            
            if (button.parentElement.parentElement.parentElement.parentElement.previousElementSibling.innerText === "Your Watchlist" || button.parentElement.parentElement.parentElement.previousElementSibling.innerText === "Your Watchlist") {
                button.parentElement.parentElement.style.opacity = "0%";
                setInterval(() => {
                    button.parentElement.parentElement.remove();
                }, 200);
            }

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
              
        }

    })
}

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
// RATING BUTTON
// ################

const ratingWrapper = document.querySelectorAll('.ratingWrapper');
const ratingButton = document.querySelectorAll('.ratingButton');
const ratingComponent = document.querySelectorAll('.ratingComponent');
const removeRating = document.querySelectorAll('.removeRating');
let clickedRating;

ratingButton.forEach(button => {
    button.addEventListener('click', function () {
        const thisWrapper = button.nextElementSibling;
        button.classList.remove("userRating");
        clickedRating = button;
        thisWrapper.classList.toggle("displayWrapper");
        document.body.style.overflow = "hidden";
    })
}); 

ratingComponent.forEach(component => {
    component.addEventListener("click", async function () {
        const {rating} = component.dataset;
        const {id, title, release_date, poster_path} = component.parentElement.dataset;
        const filmRating = {rating, id, title, release_date, poster_path};
        console.log(filmRating)
        
        try {
            const response = await axios({
                method: 'put',
                url: '/rating',
                data: filmRating
            });
            console.log(response)
        } catch (error) {
            console.log(error)
        }

        clickedRating.innerText = component.dataset.symbol;
        clickedRating.classList.add("userRating");
        document.body.style.overflow = "auto";
        
    })
});

removeRating.forEach(remove => {
    remove.addEventListener("click", async function () {
        const {rating} = remove.dataset;
        const {id, title, release_date, poster_path} = remove.parentElement.dataset;
        const filmRating = {rating, id, title, release_date, poster_path};
        
        try {
            const response = await axios({
                method: 'delete',
                url: '/rating',
                data: filmRating
            });
            console.log(response)
        } catch (error) {
            console.log(error)
        }

        clickedRating.innerText = "grade";
        clickedRating.classList.add("material-icons-outlined");
        clickedRating.classList.remove("userRating");
        document.body.style.overflow = "auto";
    })
});


// Quit rating modal when clicking outsite
document.body.addEventListener('click', function (event) {
    if (!(event.target.classList[0] == "ratingButton" || event.target.innerText == "grade" || event.target.classList.contains("rated"))) {
        document.body.style.overflow = "auto";
        ratingWrapper.forEach(thisWrapper => {
            thisWrapper.classList.remove("displayWrapper");
        })
    };
})

// ratingButton.forEach(button => {
//     button.addEventListener('click', function () {
//         button.classList.remove("userRating");
//         if (button.parentNode.querySelector(".ratingWrapper").style.display == "none") {
//             ratingWrapper.forEach(wrapper => {
//                 console.log("deleting")
//                 wrapper.style.display = "none";
//             });
//             button.parentNode.querySelector(".ratingWrapper").style.display = "flex";
//         } else {
//             button.parentNode.querySelector(".ratingWrapper").style.display = "none";
//         }
//     })
// }); 



// ratingComponent.forEach(component => {
//     component.addEventListener("click", function () {
//         ratingButton.innerText = component.dataset.img;
//         ratingButton.classList.add("userRating");
//     })
// });



// document.body.addEventListener('click', function (event) {
//     let isClickInside = ratingButton.contains(event.target);
//     if (!isClickInside) {
//         ratingWrapper.style.display = "none";
//     } 
// })

// document.body.addEventListener('click', function (event) {
//     console.log(event.target.classList[0])
//     if (!(event.target.classList[0] == "ratingButton" || event.target.innerText == "grade")) {
//         ratingWrapper.forEach(wrapper => {
//             wrapper.style.display = "none";
//         });
        
//     } 
// })

// ratingButton.addEventListener('click', function () {
//     ratingButton.classList.remove("userRating");
//     if (ratingWrapper.style.display == "none") {
//         ratingWrapper.style.display = "flex";
//     } else {
//         ratingWrapper.style.display = "none";
//     }
// })

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


