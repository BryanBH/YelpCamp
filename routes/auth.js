const express = require("express");
const router = express.Router();
const handleAsync = require("../utilities/HandleAsync");
const passport = require("passport");
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });
const {
  isAuthor,
  isLoggedIn,
  isUserProfile,
} = require("../utilities/middleware");
const authController = require("../controllers/authController");
const HandleAsync = require("../utilities/HandleAsync");

router
  .route("/register")
  .get(authController.registerForm)
  .post(upload.single("image"), handleAsync(authController.registerUser));

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

router
  .route("/profile/:id")
  .get(isLoggedIn, HandleAsync(authController.profile))
  .put(isLoggedIn, isUserProfile, HandleAsync(authController.updateProfile));

router.get(
  "/profile/:id/edit", isLoggedIn,
  isUserProfile,
  HandleAsync(authController.editProfile)
);

router.get("/logout", authController.logOut);
module.exports = router;
