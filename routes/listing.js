const express = require('express');
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");


const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
    
    if(error){
        throw new ExpressError(400, error.message); 
    }else{
        next();
    }
};

// all listings
router.get("/", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
});

// create new listing  NEW route
router.get("/new", (req,res) => {
    res.render("listings/new.ejs");
});

// Create route
router.post("/", validateListing, wrapAsync(async (req,res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
}));

// SHOW route
router.get("/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
       req.flash("error", "Listing not found!");
       return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
});

// edit route
router.get("/:id/edit", wrapAsync(async (req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
       req.flash("error", "Listing you requrested does not exist!");
       return res.redirect("/listings");
    }
    res.render("listings/edit.ejs", {listing});
}));

// Update route
router.put("/:id", validateListing, wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing");
    } 
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated!");
    res.redirect(`/listings/${id}`);
}));

// delete route
router.delete("/:id", wrapAsync( async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}));

module.exports = router;