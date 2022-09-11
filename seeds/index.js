const { default: axios } = require("axios");
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
mongoose
  .connect("mongodb://localhost:27017/yelp-camp")
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const images = [
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750506/YelpCamp/sbc0tbpinvw39fvnusc8.jpg",
    filename: "YelpCamp/sbc0tbpinvw39fvnusc8",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750506/YelpCamp/aqr0t5qek1lcyq3dskk7.jpg",
    filename: "YelpCamp/aqr0t5qek1lcyq3dskk7",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750506/YelpCamp/hp9hvpidi6uugu0k3cxu.jpg",
    filename: "YelpCamp/hp9hvpidi6uugu0k3cxu",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750507/YelpCamp/ba9niq27zs7dk9lux233.jpg",
    filename: "YelpCamp/ba9niq27zs7dk9lux233",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750507/YelpCamp/megmnowvspqfojq7v9kw.jpg",
    filename: "YelpCamp/megmnowvspqfojq7v9kw",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750507/YelpCamp/joakvtq6hhxijkhzt8xp.jpg",
    filename: "YelpCamp/joakvtq6hhxijkhzt8xp",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750507/YelpCamp/ym9leliswoksf0mrthms.jpg",
    filename: "YelpCamp/ym9leliswoksf0mrthms",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750508/YelpCamp/apc2olocozsbfbk7m4ds.jpg",
    filename: "YelpCamp/apc2olocozsbfbk7m4ds",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750508/YelpCamp/frbvzbrxjyl67rhbvnwy.jpg",
    filename: "YelpCamp/frbvzbrxjyl67rhbvnwy",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750508/YelpCamp/cmexzxruu8fr7tr4ared.jpg",
    filename: "YelpCamp/cmexzxruu8fr7tr4ared",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750508/YelpCamp/duoloowfxav8fabi2r0p.jpg",
    filename: "YelpCamp/duoloowfxav8fabi2r0p",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750509/YelpCamp/jasmxpgth2wo0kgnevaa.jpg",
    filename: "YelpCamp/jasmxpgth2wo0kgnevaa",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750509/YelpCamp/p2dqernksn3swrbibxzx.jpg",
    filename: "YelpCamp/p2dqernksn3swrbibxzx",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750510/YelpCamp/eluufqcqiyrl4qjz7eyj.jpg",
    filename: "YelpCamp/eluufqcqiyrl4qjz7eyj",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662750510/YelpCamp/kzclah1lnxw74lv0r61v.jpg",
    filename: "YelpCamp/kzclah1lnxw74lv0r61v",
  },
];

function seedImg() {
  try {
    const imgs = [];
    for (let i = 0; i < 3; i++) {
      const selectedImage = images[Math.floor(Math.random() * images.length)];

      if (!imgs.find((e) => e.url === selectedImage.url)) {
        imgs.push(selectedImage);
      }
    }
    return imgs;
  } catch (err) {
    console.log(err);
  }
}
/**
 * intial seeding of mongo db
 * generate 20 random campgrounds from 1000 different cities
 */
const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 20; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;
    const camp = new Campground({
      author: "6318fcf6b583600656bc6163",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!",
      price,
      images: seedImg(),
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
