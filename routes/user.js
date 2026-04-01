const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user.js");
const { saveRedirectUrl } = require("../middleware.js");
const wrapAsync = require("../utils/wrapAsync.js");

const usercontroller = require("../controller/user.js");
const user = require("../models/user.js");

router
  .route("/signup")
  .get(usercontroller.renderSignup)
  .post(wrapAsync(usercontroller.signup));

router
  .route("/login")
  .get(usercontroller.renderLogin)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    usercontroller.login
  );

router.route("/logout").get(usercontroller.logout);

module.exports = router;
