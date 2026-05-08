const User = require("../models/user.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

module.exports.renderSignup = (req, res) => {
    res.render("users/signup.ejs", { hideSearch: true });
};
module.exports.renderLogin = (req, res) => {
    res.render("users/login.ejs", { hideSearch: true });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);

    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  req.flash("success", "Welcome to Wanderlust! You are logged in.");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You have been logged out.");
    res.redirect("/listings");
  });
};

module.exports.profile = async (req, res) => {
    const userListings = await Listing.find({ owner: req.user._id });
    
    // Calculate total reviews and avg rating across all listings
    let totalReviews = 0;
    let ratingSum = 0;
    for(let listing of userListings) {
        const populated = await listing.populate("reviews");
        totalReviews += populated.reviews.length;
        for(let review of populated.reviews) {
            ratingSum += review.rating;
        }
    }
    const avgRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "N/A";

    res.render("users/profile", { userListings, totalReviews, avgRating });
};