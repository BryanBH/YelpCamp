const Campground = require("../models/campground");
const Review = require("../models/review");
const User = require("../models/user");
const { campgroundJoiSchema, reviewJoiSchema } = require("../schemas");
const ExpressError = require("../utilities/ExpressError");

module.exports.isLoggedIn = (req, res, next) => {
  // function coming from passport
  if (!req.isAuthenticated()) {
    //store the url they are requesting
    req.session.returnTo = req.originalUrl;
    req.flash("error", "You must be signed in!");
    return res.redirect("/login");
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${req.params.id}`);
  }
  next();
};

module.exports.isUserProfile = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user._id.equals(req.params.id)) {
    req.flash("error", "you cannot edit this profile");
    return res.redirect(`/profile${req.params.id}`);
  }
  next();
};
/**
 * Joi validation before sending to mongoose (campgroundSchema)
 * server side data validation in case client side
 * validation was overcommed
 */
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.isReviewAuthor = async (req, res, next) => {
  const { id, reviewId } = req.params;
  const review = await Review.findById(reviewId);
  if (!review.author.equals(req.user._id)) {
    req.flash("error", "You do not have permission to do that!");
    return res.redirect(`/campgrounds/${id}`);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewJoiSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
