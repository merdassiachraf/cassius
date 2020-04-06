const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const usersSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  adress: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  countryCode: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  avatar: {
    type: String,
  },
  dateOfBirth: {
    type: String  },
});
module.exports = User = mongoose.model("users", usersSchema);
