const Listing = require("./models/listing.js");
const Review = require("./models/review.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");

module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in first!");
        return res.redirect("/login");
    }       
    next();
}

module.exports.saveRedirectUrl = (req,res,next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
        // delete req.session.redirectUrl;
    }
    next();
}

module.exports.isOwner = async(req,res,next) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing || !listing.owner || !listing.owner.equals(req.user._id)) {
        req.flash("error", "You don't have permission to perform that action!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}     

module.exports.validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400, error.message); 
    }else{
        next();
    }
};

module.exports.validateReview = (req,res,next) => {
    let {error} = reviewSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400, error.message); 
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async(req,res,next) => {
    let { reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review || !review.author || !review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review!");
        return res.redirect(`/listings/${id}`);
    }
    next();
}     
