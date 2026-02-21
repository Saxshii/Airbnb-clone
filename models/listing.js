const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

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
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],
});

listingSchema.post("findOneAndDelete", async (listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in: listing.reviews,},});
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;