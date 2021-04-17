const express = require('express');
const router = express.Router();
const foodItemsModule = require("../models/foodItemsLists");
const mongoose = require("mongoose");


//Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
);

router.get("/", function(req, res){

  foodItemsModule.find({topMeal: 'true'})
    .exec()
    .then((data) => {
        // Pull the data (exclusively)
        // This is to ensure that our "data" object contains the returned data (only) and nothing else.
        data = data.map(value => value.toObject());

      res.render("general/index",{
      foodInfo: data
  });
    });
 

});

router.get("/onTheMenu", function(req, res){

  foodItemsModule.find({category: 'classic'})
  .exec()
  .then((classicData) => {
     
    classicData = classicData.map(value => value.toObject());

    foodItemsModule.find({category: 'starter'})
    .exec()
    .then((starterData) => {
       
      starterData = starterData.map(value => value.toObject());

        res.render("../views/general/onTheMenu", {
            classic: classicData,
            starter: starterData
          });
        });
      });

});

router.get("/onTheMenuClerk", function(req, res){

  foodItemsModule.find({category: 'classic'})
  .exec()
  .then((classicData) => {
     
    classicData = classicData.map(value => value.toObject());

    foodItemsModule.find({category: 'starter'})
    .exec()
    .then((starterData) => {
       
      starterData = starterData.map(value => value.toObject());
          res.render("../views/general/onTheMenuClerk", {
            classic: classicData,
            starter: starterData
          });
        });
      });

});

router.get("/welcome", function(req, res){
  res.render("general/welcome");
});

router.get("/load-data", function(req, res){
  res.render("general/clerk");
});

router.get("/customer", function(req, res){
  res.render("general/customer");
});



module.exports = router;