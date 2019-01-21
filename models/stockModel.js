var mongoose = require("mongoose");

var stockSchema = new mongoose.Schema({
  email: String,
  registrationno: String,
  name: String,
  number:Number,
  whatsnumber:Number
  
});
var model = mongoose.model("stock", stockSchema);

module.exports = model;