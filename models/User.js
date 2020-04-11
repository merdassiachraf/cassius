const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  role: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  } || {
    firstName: {
      type: String,
      required: true,
    },
    lastNme: {
      type: String,
      required: true,
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lower: true,
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
});
module.exports = User = mongoose.model("users", UserSchema);
