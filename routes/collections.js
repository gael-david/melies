// REQUIRE EXPRESS & ROUTER
const express = require("express");
const router = express.Router();
// REQUIRE CONTROLLERS
const collections = require('../controllers/collections');
// REQUIRE UTILITIES
const wrapAsync = require('../utilities/wrapAsync');

// MIDDLEWARES
const {validateCollection} = require('../middleware');
const {isLoggedIn} = require('../middleware');

router.get('/', isLoggedIn, wrapAsync(collections.userCollections))

router.post('/', isLoggedIn, validateCollection, wrapAsync(collections.createCollection))

router.get('/create',isLoggedIn, wrapAsync(collections.createCollectionForm))

router.get('/:collectionID',isLoggedIn, wrapAsync(collections.collectionPage))

router.delete('/:collectionID/delete',isLoggedIn, wrapAsync(collections.deleteCollection))

router.get('/:filmID/add',isLoggedIn, wrapAsync(collections.addToCollectionForm))

router.put('/:filmID/add',isLoggedIn, wrapAsync(collections.addToCollection))

router.delete('/:filmID/remove',isLoggedIn, wrapAsync(collections.removeFromCollection))

module.exports = router;