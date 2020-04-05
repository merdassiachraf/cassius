const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const agenciesSchema = new Schema({
  agencyAdress: { type: String, required: true },
  agencyState: { type: String, required: true },
  agencyCountry: { type: String, required: true },
  agencyCountryCode: { type: String, required: true },
  agencyPhoneNumber: { type: String, required: true },
  agencyName: { type: String, required: true },
  agencyEmail: { type: String, required: true },
  agencyPassword: { type: String, required: true },
  date: { type: Date, default: Date.now },
  avatar: { typre: String , required: true}
});
module.exports = agency = mongoose.model("agency", agenciesSchema);
