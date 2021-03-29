//const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  "fname": String,
  "lname": String,
  "email": {
      "type": String,
      "unique": true
  },
  "password": String
});
var userModel = mongoose.model("registration", userSchema);

module.exports = userModel;