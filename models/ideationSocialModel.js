

var mongoose = require("mongoose");

var socialSchema = mongoose.Schema({
  category: String,
  name: String,
  domain: String,
  socialImpact: String,
  categoryProfit: String,
  marketSegmentation: String,
  financialModel: String,
  feasibility: String,
  competition: String,
  breakEvenPoint: String
});

module.exports = mongoose.model("social", socialSchema)