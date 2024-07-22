const mongoose = require('mongoose');
const { places, descriptors } = require('./seedHelpers');
// const Campground = require('./models/campground');
const Campground = require('../models/campground');
const campground = require('../models/campground');
const cities = require('./cities');

mongoose.connect('mongodb://localhost:27017/yelp-camp').
    then(() => {
        console.log("Connection Successful!!!")
    })
    .catch(error => {
      console.log("Oh no error")
      console.log(error)
    
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random()*20)+10
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: "https://picsum.photos/200/300",
            description : "Image uploaded for better graphics!",
            price
        })
        await camp.save();
    }
    // const c = new campground({title : "purple field"})
    // await c.save()
}

// seedDB()

seedDB().then(() => {
    mongoose.connection.close();
})