const express = require("express");
const router = express.Router({ mergeParams: true });
const HandleAsync = require("../utilities/HandleAsync");

const reviewController = require("../controllers/reviewController");

const {
  validateReview,
  isLoggedIn,
  isReviewAuthor,
} = require("../utilities/middleware");

/**
 * Review post endpoint validation, creation of review and pushed to its specific campgorund
 */
router.post(
  "/",
  isLoggedIn,
  validateReview,
  HandleAsync(reviewController.createReview)
);

router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  HandleAsync(reviewController.deleteReview)
);

module.exports = router;
