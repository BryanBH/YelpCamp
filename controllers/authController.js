const User = require("../models/user");
const Campgrounds = require("../models/campground");
const Reviews = require("../models/review");

module.exports.registerForm = (req, res) => {
  res.render("auth/register");
};

module.exports.loginForm = (req, res) => {
  res.render("auth/login");
};

module.exports.registerUser = async (req, res) => {
  try {
    const { email, username, password, firstName, lastName, phoneNumber } =
      req.body;
    const user = new User({
      email,
      username,
      firstName,
      lastName,
      phoneNumber,
    });
    user.images = {
      url: req.file.path,
      filename: req.file.filename,
    };
    const registereduser = await User.register(user, password);
    req.login(user, function (err) {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp");
      res.redirect("/campgrounds");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.profile = async (req, res) => {
  const { id } = req.params;
  const currentUser = await User.findById(id);
  const totalCamps = (await Campgrounds.find({ author: id })).length;
  const numReviews = (await Reviews.find({ author: id })).length;
  res.render("auth/profile", { currentUser, totalCamps, numReviews });
};

module.exports.editProfile = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id);
  // console.log(user);
  if (!user) {
    req.flash("error", "User does not exist");
    return res.redirect("/");
  }
  res.render("auth/edit", { user });
};

module.exports.updateProfile = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, {
    ...req.body,
  });
  await user.save();
  req.flash("success", "Updated User Info")
  res.redirect(`/profile/${req.params.id}`)
};

module.exports.logOut = (req, res) => {
  req.logout(function (err) {
    if (err) return next(err);
    req.flash("success", "Goodbye!");
    res.redirect("/campgrounds");
  });
};
