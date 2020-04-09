const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
  brand: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  fuel: {
    type: String,
    required: true,
  },
  transmission: {
    type: String,
    required: true,
  },
  picture: {
    type: String,
    required: true,
  },
  pricePerDay: {
    type: Number,
    required: true,
  },
  totalDays: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  firstDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  firstTime: {
    type: Date,
    required: true,
  },
  endTime:{
    type:Date,
    required:true
  },
  agency: {
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
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
  },
  client: {
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
    country: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    adress: {
      type: String,
      required: true,
    },
  },
});
module.exports = Reservation = mongoose.model("post", ReservationsSchema);
