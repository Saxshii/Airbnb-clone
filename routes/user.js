const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controller = require("../controller/user.js");

router.get("/signup", controller.renderSignup);
router.post("/signup", wrapAsync(controller.signup));

router.get("/login", controller.renderLogin);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), controller.login);

router.get("/logout", controller.logout);

module.exports = router;