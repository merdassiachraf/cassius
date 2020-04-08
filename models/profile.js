const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  handle: {
    type: String,
    required: true,
    max: 40,
  },
  contactInformation: [
   { country: {
      type: String,
    },
    countryCode: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    adress: {
      type: String,
    },
    state: {
      type: String,
    }}
  ],
  dateOfBirth: {
    type: String,
  },
  social: {
    youtube: {
      type: String,
    },
    twitter: {
      type: String,
    },
    facebook: {
      type: String,
    },
    linkedin: {
      type: String,
    },
    instagram: {
      type: String,
    },
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = Profilee = mongoose.model("profile", ProfileSchema);
