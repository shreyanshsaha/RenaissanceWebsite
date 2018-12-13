
var mongoose = require("mongoose");

var operationSchema = mongoose.Schema({
  name: String,
  functionality: String,
  competition: String,
  intellectualProperty: String,
  sellingProp: String,
  domain: String,
  financialPotential: String,
  sustainability: String,
  cost: String,
  capitalization: String
})

module.exports = mongoose.model("operational", operationSchema);
