const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const agenciesSchema = new Schema({
  agencyPicture: { type: String },
  agencyAdress: { type: String },
  agencyState: { type: String },
  agencyCountry: { type: String },
  agencyCountryCode: { type: String },
  agencyPhoneNumber: { type: String },
  agencyName: { type: String },
  agencyEmail:{type:String},
  agencyPassword:{type:String}
});
module.exports = agency = mongoose.model("agency", agenciesSchema);
