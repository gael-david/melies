// ################
// HEADER
// ################

const userComponent = document.querySelector('.userComponent');
const userDropdown = document.querySelector('.userDropdown');
let timer;

if (userComponent) {
    userComponent.addEventListener('click', function () {
        userDropdown.classList.toggle("displayDropdown")
    })
}

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

const ratingWrapper = document.querySelector('.ratingWrapper');
const ratingButton = document.querySelectorAll('.ratingButton');
const ratingComponent = document.querySelectorAll('.ratingComponent');
const modal = document.querySelector('.modal')

const removeRating = document.createElement("p");
removeRating.classList.add("removeRating");
removeRating.innerText = "Remove your rating";

let clickedRating;

// Open rating modal
ratingButton.forEach(button => {
    button.addEventListener('click', function () {
        clickedRating = button;

        // Display modal
        button.classList.remove("userRating");
        modal.classList.toggle("displayModal");
        ratingWrapper.classList.toggle("displayWrapper");
        document.body.style.overflow = "hidden";

        // Display delete rating button
        if (clickedRating.dataset.rated === "true") {
            ratingWrapper.append(removeRating);
        } else {
            removeRating.remove();
        }
    })
}); 

// Rate the film
ratingComponent.forEach(component => {
    component.addEventListener("click", async function () {
        const {rating} = component.dataset;
        const {id, title, release_date, poster_path} = clickedRating.dataset;
        const filmRating = {rating, id, title, release_date, poster_path};

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
        clickedRating.classList.remove("material-icons-outlined");
        clickedRating.classList.add("userRating");
        clickedRating.dataset.rated = "true";

        modal.classList.toggle("displayModal");
        ratingWrapper.classList.toggle("displayWrapper");
        document.body.style.overflow = "auto";
    })
});

// Delete the film rating
removeRating.addEventListener("click", async function () {
    const {rating} = removeRating.previousElementSibling.dataset;
    const {id, title, release_date, poster_path} = clickedRating.dataset;
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
    clickedRating.dataset.rated = "false";

    modal.classList.toggle("displayModal");
    ratingWrapper.classList.toggle("displayWrapper");
    document.body.style.overflow = "auto";
});


// Quit rating modal when clicking outside
modal.addEventListener('click', function (event) {
        document.body.style.overflow = "auto";
        modal.classList.toggle("displayModal");
        ratingWrapper.classList.remove("displayWrapper");
});