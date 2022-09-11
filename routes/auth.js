const express = require("express");
const router = express.Router();
const handleAsync = require("../utilities/HandleAsync");
const passport = require("passport");

const authController = require("../controllers/authController");

router
  .route("/register")
  .get(authController.registerForm)
  .post(handleAsync(authController.registerUser));

// login form
router
  .route("/login")
  .get(authController.loginForm)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
      keepSessionInfo: true,
    }),
    authController.loginUser
  );

router.get("/logout", authController.logOut);
module.exports = router;
