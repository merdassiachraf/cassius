const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClientsSchema = new Schema({
  clientPicture:{type: String},
  clientAdress:{type:String},
  clientState: {type:String},
  clientCountry: {type:String},
  clientCountryCode:{type:String},
  clientPhoneNumber:{type:String},
  clientName:{type:String},
  clientEmail:{type:String},
  clientPassword:{type:String}
});
module.exports = client= mongoose.model("client", ClientsSchema);
