const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose=require('mongoose')

const db = require("./config/default").mongoURI;

const app = express();

//bosy parser middlewear

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// connect to mongodb

mongoose
  .connect(db,{ useUnifiedTopology: true,useNewUrlParser: true  })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

//passport middlewear

app.use(passport.initialize());

//passport config

require("./config/passport")(passport);

//Define routers

app.use("/posts", require("./routes/Posts"));
app.use("/users", require("./routes/Users"));
app.use("/profile", require("./routes/Profile"));

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  err
    ? console.log("Can't connect DataBase")
    : console.log(`dataBase is connected on port ${port}`);
});
