const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const listingSchema = new Schema({
    title: { 
        type: String,
        required: true,
    },
    description: String,
    image: {
        filename: {
        type: String,
        default: "listingimage"
         },
        url: {
        type: String,
        default: "https://unsplash.com/photos/a-lake-surrounded-by-mountains-and-trees-under-a-blue-sky-jV8916l2k0I"}
        },
    price: Number,
    location: String,
    country: String
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;