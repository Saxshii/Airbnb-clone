const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema} = require("./schema.js");

// DATABASE CONNECTION
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then( () => { console.log("connectd to database");
    }).catch( (err) => {
        console.log(err);
    });
async function main(){
    await mongoose.connect(MONGO_URL);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const validateListing = (req,res,next) => {
    let {error} = listingSchema.validate(req.body);
   
    if(error){
        throw new ExpressError(400, result.error);
    }else{
        next();
    }
}

// all listings
app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
});

// create new listing  NEW route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
});
// Create route
app.post("/listings", validateListing, wrapAsync(async (req,res,next) => {
    listingSchema.validate(req.body);
    console.log(result);
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));

// show specific listing  SHOW route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

// edit route
app.get("/listings/:id/edit", wrapAsync(async (req,res) =>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update route
app.put("/listings/:id", validateListing, wrapAsync(async (req,res) => {
    if(!req.body.listing){
        throw new ExpressError(400, "send valid data for listing");
    } 
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

// delete route
app.delete("/listings/:id", wrapAsync( async (req,res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
}));

app.get("/", (req,res) => {
    res.send("HI, I am root");
});

app.use((req, res, next) => {
    next(new ExpressError(404, "page not found"));
});

app.use((err, req, res, next) => {
    let{statusCode = 500, message =" something went wrong"} = err;
    res.render("error.ejs", {message});
    // res.status(statusCode).send(message);
})

app.listen(port, (req, res) => {
    console.log(`server is listening on port: ${port}`);
});