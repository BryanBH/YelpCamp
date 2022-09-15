if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const mongoose = require("mongoose");
const Campground = require("../models/campground");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Database connection established");
  })
  .catch((err) => {
    console.log(err);
  });

const sample = (array) => array[Math.floor(Math.random() * array.length)];

const images = [
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929398/YelpCamp/x60mo9mrqrqeni0l8pcd.jpg",
    filename: "YelpCamp/x60mo9mrqrqeni0l8pcd",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929399/YelpCamp/c9buyu7m5mhsowsqvmf3.jpg",
    filename: "YelpCamp/c9buyu7m5mhsowsqvmf3",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929401/YelpCamp/oz6hvjzh9a5kpt15wopo.jpg",
    filename: "YelpCamp/oz6hvjzh9a5kpt15wopo",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929406/YelpCamp/n1m7qgffqyznnnrtvubb.jpg",
    filename: "YelpCamp/n1m7qgffqyznnnrtvubb",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929408/YelpCamp/tzezmlbt65ndecdnial8.jpg",
    filename: "YelpCamp/tzezmlbt65ndecdnial8",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929411/YelpCamp/rl9uyn1ogrtb073evmcf.jpg",
    filename: "YelpCamp/rl9uyn1ogrtb073evmcf",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929416/YelpCamp/ktf9ahm4ccy1auugc4bl.jpg",
    filename: "YelpCamp/ktf9ahm4ccy1auugc4bl",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929416/YelpCamp/xwsr6mkyhvjvooekgwzh.jpg",
    filename: "YelpCamp/xwsr6mkyhvjvooekgwzh",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929420/YelpCamp/lmqgqofvdfbepnyxjzvt.jpg",
    filename: "YelpCamp/lmqgqofvdfbepnyxjzvt",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929424/YelpCamp/t8tdrk2shcgdkpj6khzb.jpg",
    filename: "YelpCamp/t8tdrk2shcgdkpj6khzb",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929425/YelpCamp/hh1nza71bb9dkr2vypwo.jpg",
    filename: "YelpCamp/hh1nza71bb9dkr2vypwo",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929427/YelpCamp/w0y4tzcvp5zvpzik7hzi.jpg",
    filename: "YelpCamp/w0y4tzcvp5zvpzik7hzi",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929430/YelpCamp/ltypfjlfmumkxhl2brgy.jpg",
    filename: "YelpCamp/ltypfjlfmumkxhl2brgy",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929433/YelpCamp/ac1zrneblrjeek9ixpeo.jpg",
    filename: "YelpCamp/ac1zrneblrjeek9ixpeo",
  },
  {
    url: "https://res.cloudinary.com/dl4elsbqg/image/upload/v1662929434/YelpCamp/piz6zvy6dzf2nenmd5hl.jpg",
    filename: "YelpCamp/piz6zvy6dzf2nenmd5hl",
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
  // await Campground.deleteMany({});
  for (let i = 0; i < 300; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const price = Math.floor(Math.random() * 30) + 10;

    const campLocation = `${cities[random1000].city}, ${cities[random1000].state}`;

    const camp = new Campground({
      // Estefania Author
      // bryan 63213927b7aac35b4736bb19
      author: "63213927b7aac35b4736bb19",
      location: campLocation,
      title: `${sample(descriptors)} ${sample(places)}`,
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!",
      price,
      images: seedImg(),
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
    });

    await camp.save();
  }
};

seedDB().then(() => {
  mongoose.connection.close();
});
