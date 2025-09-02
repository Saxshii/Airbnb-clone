const express = require("express");
const app = express();
const port = 8080;
const mongoose = require("mongoose");
const Listing = require("./models/listing");

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



app.get("/test")







app.get("/", (req,res) => {
    res.send("HI, I am root");
});

app.listen(port, (req, res) => {
    console.log(`server is listening on port: ${port}`);
});