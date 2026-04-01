const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../../models/listing.js");
const { init } = require("../../models/review.js");

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

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({...obj, owner: "64a1c8e5b9c0f2d9b3e7c8a"}));

    await Listing.insertMany(initData.data);
    console.log("data initialized")
};

initDB();