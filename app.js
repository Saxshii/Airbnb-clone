const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");

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

// app.get("/testListing", async (req,res) => { 
// let sampleListing = new Listing({
//     title: "my home",
//     description: "by the beach",
//     price: 1200,
//     location: "goa",
//     country: "india"
// });
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successful listing");
// });

app.get("/listings", async (req,res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", {allListings});
});

app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});


app.get("/", (req,res) => {
    res.send("HI, I am root");
});

app.listen(port, (req, res) => {
    console.log(`server is listening on port: ${port}`);
});