const express = require('express');
const path = require("path");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const session = require('express-session');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path:"./config/keys.env"});

const mongoMock = require('./mongo-mock');

async function main() {
  const mongoUri = await mongoMock.start();
  process.env.MONGO_DB_CONNECTION_STRING = mongoUri;

  const app = express();

  app.set('view engine', '.hbs');

  // Set up body parser
  app.use(bodyParser.urlencoded({ extended: false }));

  // Set up express-fileupload
  app.use(fileUpload());

  app.use(express.static(__dirname + "/static"));

  app.engine('.hbs', exphbs({
    extname: '.hbs',
    defaultLayout: 'main'
  }));

  app.set('view engine', '.hbs');

  // Set up express-session
  app.use(session({
    secret: "desiKhana",
    resave: false,
    saveUninitialized: true
  }));

  app.use((req, res, next) => {
    res.locals.user = req.session.user;
    next();
  });

  const generalController = require("./controllers/general");
  const registrationController = require("./controllers/registration");
  const loginController = require("./controllers/login");
  const loadDataController = require("./controllers/loadData");

  app.use("/", generalController);
  app.use("/registration", registrationController);
  app.use("/login", loginController);
  app.use("/load-data", loadDataController);

  // Set up and connect to MongoDB
  mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
  .then(() => {
    console.log("Connected to the MongoDB database.");
    seedMockData();
  })
  .catch((err) => {
    console.log(`There was a problem connecting to MongoDB ... ${err}`);
  });

  const HTTP_PORT = process.env.PORT || 3000;

  app.listen(HTTP_PORT, () => {
    console.log("Express http server listening on: " + HTTP_PORT);
  });
}

const foodItemsModule = require("./models/foodItemsLists");

async function seedMockData() {
  const count = await foodItemsModule.countDocuments();
  if (count > 0) return;

  const meals = [
    {
      title: "Butter Chicken & Naan",
      wIncluded: "Tandoori chicken, butter sauce, garlic naan, basmati rice",
      description: "Creamy, rich butter chicken slow-cooked in a tomato-butter gravy with aromatic spices. Served with freshly baked garlic naan.",
      category: "classic",
      price: 24.99,
      cookingTime: 35,
      servings: 2,
      calories: 720,
      topMeal: "true",
      photo: "/images/butter chicken naan.jpg"
    },
    {
      title: "Shahi Paneer Thali",
      wIncluded: "Paneer cubes, cashew gravy, jeera rice, naan, raita",
      description: "Royal paneer cooked in a luxurious cashew and cream gravy with saffron and cardamom. A true Mughlai experience.",
      category: "classic",
      price: 22.99,
      cookingTime: 30,
      servings: 2,
      calories: 640,
      topMeal: "true",
      photo: "/images/shahiPaneer.jpg"
    },
    {
      title: "Daal Makhani Bowl",
      wIncluded: "Black lentils, cream, butter, jeera rice, pickle",
      description: "Creamy black lentils simmered overnight with tomatoes, ginger, garlic, and finished with cream and butter.",
      category: "classic",
      price: 19.99,
      cookingTime: 25,
      servings: 2,
      calories: 580,
      topMeal: "true",
      photo: "/images/daalMakhni.jpg"
    },
    {
      title: "Chana Masala",
      wIncluded: "Chickpeas, onion-tomato masala, bhatura, salad",
      description: "Punjabi-style chickpeas in a tangy, spicy onion-tomato gravy. Best enjoyed with fluffy bhaturas.",
      category: "classic",
      price: 18.99,
      cookingTime: 28,
      servings: 2,
      calories: 540,
      topMeal: "false",
      photo: "/images/chanaMasala.jpg"
    },
    {
      title: "Crispy Vegetable Samosas",
      wIncluded: "6 samosas, tamarind chutney, mint chutney",
      description: "Hand-wrapped crispy pastries filled with spiced potatoes, peas, and cashews. Deep-fried to golden perfection.",
      category: "starter",
      price: 12.99,
      cookingTime: 20,
      servings: 2,
      calories: 380,
      topMeal: "true",
      photo: "/images/samosas.jpg"
    },
    {
      title: "Dosa with Sambhar",
      wIncluded: "Crispy dosa, sambhar, coconut chutney, potato masala",
      description: "South Indian fermented rice crepe served with lentil sambhar and fresh coconut chutney.",
      category: "starter",
      price: 16.99,
      cookingTime: 22,
      servings: 2,
      calories: 420,
      topMeal: "true",
      photo: "/images/dosa.jpg"
    },
    {
      title: "Idli Sambhar Platter",
      wIncluded: "4 idlis, sambhar, coconut chutney, gunpowder",
      description: "Steamed rice cakes — soft, fluffy, and healthy. Served with traditional sambhar and chutneys.",
      category: "starter",
      price: 14.99,
      cookingTime: 18,
      servings: 2,
      calories: 320,
      topMeal: "false",
      photo: "/images/idli sambhar.jpg"
    },
    {
      title: "Onion Bhajia",
      wIncluded: "8 bhajias, green chutney, chai masala",
      description: "Crispy gram flour fritters with thinly sliced onions, ajwain, and green chilies. Perfect monsoon snack.",
      category: "starter",
      price: 11.99,
      cookingTime: 15,
      servings: 2,
      calories: 360,
      topMeal: "false",
      photo: "/images/bhajia.jpg"
    }
  ];

  await foodItemsModule.insertMany(meals);
  console.log("Seeded mock meal data.");
}

main().catch(err => console.error(err));

