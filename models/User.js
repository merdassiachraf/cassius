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
  agree: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = User = mongoose.model("users", UserSchema);
