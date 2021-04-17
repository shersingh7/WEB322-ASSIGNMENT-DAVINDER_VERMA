const express = require('express');
const path = require("path");
const { REPLServer } = require('repl');
const foodItemsModule = require("../models/foodItemsLists");
const NameModel = require('../models/registration');
const router = express.Router();

let total=0; // Total price for shopping cart

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

router.get("/shoppingCart", (req, res)=>{
    
    req.session.user.cart.forEach(meal => {total += meal.price;});

    res.render("general/shoppingCart", {
        cart: req.session.user.cart,
       totalPrice: total.toFixed(2) 
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

router.get("/:title", (req,res)=>{

  
    foodItemsModule.find({title: req.params.title})
    .exec()
    .then((mealKit)=>{
        mealKit = mealKit.map(value => value.toObject());
        res.render("../views/general/desc",{
            kit: mealKit
        });
    });
});

router.post("/addToCart/:title", (req,res)=>{
    
    let errors = [];
    let found = false;
    if(req.session.user)
    {
        if(req.session.user.cart[0])
        {
            for(var meal in req.session.user.cart)
            {
                if(req.session.user.cart[meal].title === req.params.title) 
                {
                    req.session.user.cart[meal].qty++;
                    found = true;
                    res.redirect("/load-data/shoppingCart");
                    return;
                }
            }
            if(found != true)
            {
                foodItemsModule.find({title: req.params.title})
                .exec()
                .then((mealKit)=>{
                    req.session.cart = req.session.cart || [];
                   
                    let toBeCarted = mealKit.map(value => {
                        return {
                            title: value.title,
                            wIncluded: value.wIncluded,
                            description: value.description,
                            category: value.category,
                            price: value.price,
                            cookingTime: value.cookingTime,
                            servings: value.servings,
                            calories: value.calories,
                            photo: value.photo,
                            qty: 1
                        }
                    });
                    req.session.user.cart.push(toBeCarted[0]);
                    res.redirect("/load-data/shoppingCart");
                });

                    
            }
        }
        else
        {
            
            foodItemsModule.find({title: req.params.title})
            .exec()
            .then((mealKit)=>{
                req.session.cart = req.session.cart || [];
            
                let toBeCarted = mealKit.map(value => {
                    return {
                        title: value.title,
                        wIncluded: value.wIncluded,
                        description: value.description,
                        category: value.category,
                        price: value.price,
                        cookingTime: value.cookingTime,
                        servings: value.servings,
                        calories: value.calories,
                        photo: value.photo,
                        qty: 1
                    }
                });
                req.session.user.cart.push(toBeCarted[0]);
                res.redirect("/load-data/shoppingCart");
       
            });

        }
    }
    else 
    {
        errors.push("You need to be logged in to buy!!!");
  
        res.render("general/login", {
            errors
        });
    }


});

router.post("/check-out", (req, res) => {
    let result = [];
    console.log("Thank you for shopping with us!!!");
    result.push("Thank you for shopping with us!!!");


    let orderDetails = 
    `<table style="border-spacing: 20px">
        <tr>
            <th>        Name        </th>
            <th>        Description     </th>
            <th>        Price       </th>
            <th>        Quantity        </th>
        </tr>`;

    req.session.user.cart.forEach(mealKit =>{
        orderDetails += 
        `<tr>
            <td>    ${mealKit.title}    </td>
            <td>    ${mealKit.description}  </td>
            <td>    ${mealKit.price}    </td>
            <td>    ${mealKit.qty}  </td>
        </tr>`;
    });

    orderDetails += `</table>`;

    const sgMail = require("@sendgrid/mail");
    sgMail.setApiKey(process.env.SEND_GRID_API_KEY);

    const msg = {
        to: req.session.user.email,
        from: "dverma22@myseneca.ca",
        subject: "Contact Us Form Submission",
        html:
            ` <p>You have place the order for</p>
            ${orderDetails}
            <p>The total price is ${total}</p>`
    };
      // Asyncronously sends the email message.
      sgMail.send(msg)
      .then(() => {
        req.session.user.cart = [];
        total = 0;
        res.render("general/shoppingCart",{
            result: result
        });
          })
      .catch(err => {
          console.log(`Error ${err}`);
          res.send(`CANT SEND EMAIL:- ${err}`);
      }); 


  });


module.exports = router;  

