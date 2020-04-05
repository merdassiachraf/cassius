const mongoose = require("mongoose");
const config = require("config");

const connectDB = () => {
  mongoose
    .connect(config.get("mongoURI"), {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    .then(() => console.log("mongoose connected"))
    .catch(err => console.log("err"));
};

module.exports = connectDB;
