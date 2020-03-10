const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const connectDB = require("./config/connectDB");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const expressValidator= require('express-validator')
const flash=require('connect-flash')

const app = express();

app.use(express.json());

connectDB();

//define view engine
app.set('view engine','ejs')

//define static folder
app.use('*',express.static('public'))

//body-parser middelwear
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//setup express-flash
app.use(flash())

//setup express-messages middleware
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
  });

//setup express-validator middleware
app.use(expressValidator())

//session middelweear
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//cookie parser midellweear
app.use(cookieParser());

//Define routers

app.use("/posts", require("./routes/Posts"));

app.use("/agencies", require("./routes/Agencies"));

app.use("/clients", require("./routes/Clients"));

app.use("/", require("./routes/defaultRouter"));

// deined 404 middlwear(page not found)
app.use((req, res) => {
  res.status(404).send("Page not found");
});

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  err
    ? console.log("Can't connect dataBase")
    : console.log(`dataBase is connected on port ${port}`);
});
