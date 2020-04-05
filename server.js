const express = require("express");
const bodyParser= require ("body-parser")

const connectDB = require("./config/connectDB");

const app = express();
//bosy parser middlewear
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

connectDB();

//Define routers

app.use("/posts", require("./routes/Posts"));
app.use("/agencies", require("./routes/Agencies"));
app.use("/clients", require("./routes/Clients"));
app.use("/client_profile", require("./routes/ClientProfile"));
app.use("/agency_profile", require("./routes/AgencyProfile"));

const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  err
    ? console.log("Can't connect dataBase")
    : console.log(`dataBase is connected on port ${port}`);
});
