const express = require('express');
const path = require("path");
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const fileUpload = require("express-fileupload");
const session = require('express-session');
const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({path:"./config/keys.env"});

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
  // res.locals.user is a global handlebars variable.
  // This means that ever single handlebars file can access that user variable
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
})
.catch((err) => {
  console.log(`There was a problem connecting to MongoDB ... ${err}`)
});


var HTTP_PORT = process.env.PORT;

// call this function after the http server starts listening for requests
function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

// setup http server to listen on HTTP_PORT
app.listen(HTTP_PORT, onHttpStart);

