const Campground = require("../models/campground");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mbxToken = process.env.MAPBOX_TOKEN;
const geoCoder = mbxGeocoding({ accessToken: mbxToken });
const { cloudinary } = require("../cloudinary");

module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  console.log(campgrounds.images);
  res.render("campgrounds/index", { campgrounds });
};

module.exports.renderNewForm = (req, res) => {
  res.render("campgrounds/new");
};

module.exports.createCampground = async (req, res) => {
  const geoData = await geoCoder
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  const campground = new Campground(req.body.campground);
  campground.geometry = geoData.body.features[0].geometry;
  campground.images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.author = req.user._id;
  await campground.save();
  req.flash("success", "Successfully created new campground");
  res.redirect(`/campgrounds/${campground._id}`);
  console.log(campground);
};

module.exports.showCampground = async (req, res) => {
  const camp = await Campground.findById(req.params.id)
    // populate each review author
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    // populate the campground author
    .populate("author");
  console.log(camp);
  if (!camp) {
    req.flash("error", "Campground not found");
    res.redirect("/campgrounds");
  }
  res.render("campgrounds/details", { camp });
};

module.exports.editForm = async (req, res) => {
  const camp = await Campground.findById(req.params.id);
  if (!camp) {
    req.flash("error", "Campground not found");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { camp });
};

module.exports.editCampground = async (req, res) => {
  console.log(req.body);
  const campground = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  const images = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  campground.images.push(...images);
  campground.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
    }
    await campground.updateOne({
      $pull: { images: { filename: { $in: req.body.deleteImages } } },
    });
    console.log(campground);
  }
  req.flash("success", "Successfully updated campground");
  res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
  await Campground.findByIdAndDelete(req.params.id);
  req.flash("success", "Successfully deleted campground");
  res.redirect("/campgrounds");
};
