const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const controller = require("../controller/user.js");
const userController = require("../controller/user.js");
const { isLoggedIn } = require("../middleware.js");

router.get("/signup", controller.renderSignup);
router.post("/signup", wrapAsync(controller.signup));

router.get("/login", controller.renderLogin);
router.post("/login", saveRedirectUrl, passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
}), controller.login);

router.get("/logout", controller.logout);

router.get("/profile", isLoggedIn, userController.profile);

module.exports = router;