const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
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
  endTime: {
    type: Date,
    required: true,
  },
});
module.exports = Reservation = mongoose.model("post", ReservationsSchema);
