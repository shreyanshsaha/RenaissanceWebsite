
var mongoose = require('mongoose')

var bussinessSchema = mongoose.Schema({
  name: String,
  use: String,
  segmentation: String,
  competition: String,
  financeModel: String,
  feasibility: String,
  breakEvenPoint: String,
  intellectualProperty: String
});

module.exports = mongoose.model("bussiness", bussinessSchema);
