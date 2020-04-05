const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/connectDB");

const app = express();

app.use(express.json());

connectDB();


//body-parser middelwear
app.use(bodyParser.urlencoded({ extended: false }));

//parse application/json
app.use(bodyParser.json());

//Define routers

app.use("/posts", require("./routes/Posts"));

app.use("/agencies", require("./routes/Agencies"));

app.use("/clients", require("./routes/Clients"));

app.use("/", require("./routes/defaultRouter"));


const port = process.env.PORT || 5000;

app.listen(port, (err) => {
  err
    ? console.log("Can't connect dataBase")
    : console.log(`dataBase is connected on port ${port}`);
});
