const express = require('express');
const bcrypt = require("bcryptjs");
const path = require("path");
const NameModel = require('../models/registration');
const mongoose = require("mongoose");

const router = express.Router();

//Connect to MongoDB
mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true
}
);

router.get("/", function(req, res){
    res.render("general/registration");
});
  
router.post("/", function(req, res){
  
    const newName = new NameModel({
      lname: req.body.lname,
      fname: req.body.fname,
      email: req.body.email,
      password: req.body.password
  });
  
    const { fname, lname, email, password } = req.body;
  
    let validationResults = {};
    let passedValidation = true;
  
    var emailPattern = /^[^\s@]+@[^\s@]+$/; //SRC:- https://stackoverflow.com/questions/940577/javascript-regular-expression-email-validation
    var passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/; //SRC:- https://www.w3resource.com/javascript/form/password-validation.php
  
    if(typeof fname !== "string" || fname.length === 0)
    {
      validationResults.fname = "You must specify a first name."
      passedValidation = false;
    }
    else if (fname.length < 2) 
    {
        validationResults.fname = "The first name must be at least 2 characters.";
        passedValidation = false;
    }
  
    if (typeof lname !== "string" || lname.length === 0) 
    {
      validationResults.lname = "You must specify a first name."
      passedValidation = false;
    }
    else if (lname.length < 2) 
    {
        validationResults.lname = "The last name must be at least 2 characters.";
        passedValidation = false;
    }
  
    if(typeof email !== "string" || email.length === 0 || (!email.match(emailPattern)))
    {
      validationResults.email = "Enter correct email address.";
      passedValidation = false;
    }
  
    if(!password.match(passwordPattern))
    {
      validationResults.password = "Password length must have special characters.";
      passedValidation = false;
    }
    else if(password.length < 8)
    {
      validationResults.password = "Password length must be atleast 8 characters.";
      passedValidation = false;
    }
  
    if(passedValidation)
    {
      newName.save((err)=>
      {
        if (err) 
        {
          validationResults.email = "Email Address already exists in database.";
          console.log("Couldn't create the new name:" + err);

          res.render("general/registration", 
          {
            validationResults: validationResults,
            values: req.body
          });
        }else {
          console.log("Successfully created a new name: " + newName.fname);
         const sgMail = require("@sendgrid/mail");
      sgMail.setApiKey(process.env.SEND_GRID_API_KEY);
  
      const msg = {
          to: email,
          from: "dverma22@myseneca.ca",
          subject: "Contact Us Form Submission",
          html:
              `Welcome to Desi Khana ${fname} ${lname}<br>
              My name is Davinder Verma and you have visited Desi Khana`
      };
        // Asyncronously sends the email message.
        sgMail.send(msg)
        .then(() => {
          req.session.user = newName;
            res.redirect("/welcome");
        })
        .catch(err => {
            console.log(`Error ${err}`);
            res.send(`CANT SEND EMAIL:- ${err}`);
        }); 
     };
      });
    }
    
});

  module.exports = router;