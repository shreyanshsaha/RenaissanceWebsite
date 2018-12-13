//! Depricated
//! TO BE DELETED
var mongoose = require("mongoose");

var summarySchema = new mongoose.Schema({
  teamId: {type: mongoose.Schema.ObjectId},
  startupName: String,
  startupType: String,
  isSubmitted: {type: Boolean, default: false},
  executiveSummary: String
});

module.exports = mongoose.model("executiveSummary", summarySchema);
