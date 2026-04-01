const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const controller = require("../controller/listings.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

router
  .route("/")
  .get(wrapAsync(controller.index))
  .post( isLoggedIn, validateListing, upload.single("listing[image]"),   wrapAsync(controller.createLIsting));

router
  .get("/new",isLoggedIn,(req, res) => { res.render("listings/new.ejs");}
  );

router
  .route("/:id")
  .get(wrapAsync(controller.showListing))
  .put(
    isLoggedIn,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(controller.updateListing),
  )
  .delete(
    isLoggedIn,
    isOwner,
    wrapAsync(controller.destroyListing));

router
  .get("/:id/edit",isLoggedIn,isOwner,wrapAsync(controller.editLIsting));

module.exports = router;
