// REQUIRE MONGODB MODELS
const Rating = require('../models/rating');

module.exports.ratingPage = async function (req,res,next) {
    const {ratedFilms} = res.locals;
    res.render('rating', {name: "Your Ratings", ratedFilms})
};

module.exports.addRating = async function (req, res,next) {
    if (req.isAuthenticated()) {

        try {
            const id = Number(req.body.id);
            const ratingData = req.body;
            const { rating } = req.body;

            const {ratedFilms} = res.locals;
            const inRatedList = ratedFilms.some(e => e.id === id);

            const userRating = await Rating.findOne({ 'user': req.user._id });
        
            if (!inRatedList) {
                userRating.ratedFilms.push(ratingData);
                await userRating.save();
            } else if (inRatedList) {
                userRating.ratedFilms.find(element => element.id == id).rating = rating;
                await userRating.save();
            }
            res.sendStatus(200);
        } catch (error) {
            console.log(error)
        }

    } else {
        res.redirect("/login")
    }
};

module.exports.removeRating = async function (req,res,next) {
    const id = Number(req.body.id);

    let userRating = await Rating.findOne({ 'user': req.user._id });

    const {ratedFilms} = res.locals;
    const inRatedList = ratedFilms.some(e => e.id === id);

    if (inRatedList) {
        userRating.ratedFilms = userRating.ratedFilms.filter(e => e.id !== id);
        await userRating.save();
    }

    res.sendStatus(200);
};