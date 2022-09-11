const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

const HandleAsync = require("../utilities/HandleAsync");

// controller with all the logic used in each route
const campgroundController = require("../controllers/campgroundContoller");

const {
  isLoggedIn,
  isAuthor,
  validateCampground,
} = require("../utilities/middleware");

/**
 * index & create campground
 */
router
  .route("/")
  .get(HandleAsync(campgroundController.index))
  .post(
    isLoggedIn,
    upload.array("images"),
    validateCampground,
    HandleAsync(campgroundController.createCampground)
  );

// new campground form
router.get("/new", isLoggedIn, campgroundController.renderNewForm);

/**
 * show, update/put & delete
 */
router
  .route("/:id")
  .get(HandleAsync(campgroundController.showCampground))
  .put(
    isLoggedIn,
    isAuthor,
    upload.array("images"),
    validateCampground,
    HandleAsync(campgroundController.editCampground)
  )
  .delete(isAuthor, HandleAsync(campgroundController.deleteCampground));

// edit campground form
router.get(
  "/:id/edit",
  isLoggedIn,
  isAuthor,
  HandleAsync(campgroundController.editForm)
);

module.exports = router;
