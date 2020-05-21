const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  method: {
    type: String,
    enum: ["local", "google", "facebook", "github"],
    required: true,
  },
  local: {
    name: {
      type: String,
    },
    email: {
      type: String,
      lower: true,
    },
    password: {
      type: String,
    },
    agree: {
      type: String,
    },
  },
  google: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      lower: true,
    },
  },
  facebook: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      lower: true,
    },
  },
  github: {
    id: {
      type: String,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      lower: true,
    },
  },
  role: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = User = mongoose.model("users", UserSchema);
