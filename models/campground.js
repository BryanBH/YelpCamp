const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review");

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace("/upload", "/upload/w_300");
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  location: String,
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  reviews: [
    {
      //object id from the Review model
      type: Schema.Types.ObjectId,
      ref: "Reviews",
    },
  ],
});

// after the campground is deleted, the findOneAndDelete middleware is triggered so it not only deletes the campground but we then delete the reviews using the middleware
// Middleware used to delete all reviews from the campground after a campground is deleted.
CampgroundSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    // delete all reviews where the id field is in the doc reviews array
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    });
  }
});

module.exports = mongoose.model("Campground", CampgroundSchema);
