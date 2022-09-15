const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

ImageSchema.virtual("thumbnail").get(function () {
  return this.url.replace(
    "/upload",
    "/upload/ar_1.0,c_thumb,g_faces,w_0.6,z_0.5/r_max/co_grey,e_shadow,x_15,y_10"
  );
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  images: ImageSchema,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phoneNumber: {
    type: String,
    required: true,
  },
});

//adds username and passport fields to userSchema and ensure no duplicates
userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
