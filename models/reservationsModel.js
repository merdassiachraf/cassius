const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ReservationsSchema = new Schema({
  brand: { type: String },
  model: { type: String },
  fuel: { type: String },
  transmission: { type: String },
  carPicture1: { type: String },
  carPicture2: { type: String },
  carPicture3: { type: String },
  carPicture4: { type: String },
  carPicture5: { type: String },
  carPicture6: { type: String },
  carPicture7: { type: String },
  carPicture8: { type: String },
  carPicture9: { type: String },
  carPicture10: { type: String },
  state: { type: String },
  country: { type: String },
  pricePerDay: { type: Number },
  agencyState: { type: String },
  totalDays: { type: Number },
  totalPrice: { type: Number },
  firstDate: { type: String },
  endDate: { type: String },
  firstTime: { type: String },
  agencyCountryCode: { type: String },
  agencyPhoneNumber: { type: String },
  agencyName: { type: String },
  agencyEmail: { type: String }
});
module.exports = Reservation = mongoose.model("post", ReservationsSchema);
