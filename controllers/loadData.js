const express = require('express');
const bcrypt = require("bcryptjs");
const path = require("path");
const foodItemsModule = require("../models/foodItemsLists");
const { userInfo } = require('os');
const router = express.Router();

router.get("/meal-kits", (req, res) => {
  res.render("general/clerk");
});

router.post("/meal-kits", (req, res) => {

    let result = [];

    const data = new foodItemsModule({
        title: req.body.title,
        wIncluded: req.body.wIncluded,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        cookingTime: req.body.cookingTime,
        servings: req.body.servings,
        calories: req.body.calories,
        topMeal: req.body.topMeal,
    });

        // Search MongoDB for a document with the matching email address.
        foodItemsModule.findOne({
            title: req.body.title,
        })
        .then((meal) => {
            if (meal) {

                
                result.push("Oops, the meal already exits in database!!!");

                res.render("general/clerk", {
                    result

                });   
            }
            else
            {
                data.save()
                        .then((mealSaved) => {
                        // User was saved correctly.
                        console.log(`Meal kit ${mealSaved.title} has been saved to the database.`);
                
                        // Rename the file name so that it is unique on our system.
                        req.files.photo.name = `pro_pic_${mealSaved._id}${path.parse(req.files.photo.name).ext}`;
                
                        // Copy the image data to a file in the "public/uploads" folder.
                        req.files.photo.mv(`static/images/uploads/${req.files.photo.name}`)
                        .then(() => {
                
                            // Update the user document so that it contains the name of the image
                            // file we saved. Do this as a second step the file could not be saved
                            // correctly.
                            foodItemsModule.updateOne({
                                _id: mealSaved._id
                            }, {
                                photo: `./images/uploads/${req.files.photo.name}`
                            })
                            .then(() => {
                                console.log("meal kit was updated with the meal pic file name.")
                                result.push("The meal-kit is added.")
  
                                res.render("general/clerk", {
                                    result

                                });                            
                            })
                            .catch((err) => {
                                console.log(`Error updating the adding photo.  ${err}`);
                                res.redirect("/");
                            });
                        });
                    })

                    .catch((err) => {
                        console.log(`Error adding meal to the database.  ${err}`);
                
                        res.redirect("/");
                    });
            };
                    
        });
});

router.post("/update", (req, res) => {

    foodItemsModule.updateOne({
            _id: req.body.id,
            }, {
            $set: {
                title: req.body.title,
                wIncluded: req.body.wIncluded,
                description: req.body.description,
                price: req.body.price,
                cookingTime: req.body.cookingTime,
                servings: req.body.servings,
                calories: req.body.calories,
            }
            })
            .exec()
            .then(() => {
                console.log("Successfully updated the Meal: " + req.body.title);

                let result = [];
                result.push("Successfully updated the Meal: " + req.body.title);

                res.render("general/onTheMenuClerk",{
                    result
                });

            })
            .catch((err)=>{
                console.log(`Error updating meal to the database.  ${err}`);

            })
});

module.exports = router;  

