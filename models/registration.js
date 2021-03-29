const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NameSchema = new Schema({
  fname: String,
  lname: String,
  email: {
      type: String,
      unique: true
  },
  password: String
});

//This function is called before a user is saved to the database.
NameSchema.pre("save", function(next) {
  var user = this;

  // Generate a unique salt.
  bcrypt.genSalt(10)
  .then((salt) => {

      // Hash the password, using the salt.
      bcrypt.hash(user.password, salt)
      .then((encryptedPwd) => {
          // Password was hashed, update the user password.
          // The new hased password will be saved to the database.
          user.password = encryptedPwd;
          next();
      })
      .catch((err) => {
          console.log(`Error occured when hashing. ${err}`);
       });
  })
  .catch((err) => {
      console.log(`Error occured when salting. ${err}`);
   });
});


const NameModel = mongoose.model("Registration", NameSchema);

module.exports = NameModel;
