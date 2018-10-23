
var mongoose = require("mongoose");

var summarySchema = new mongoose.Schema({
  teamId: {type: mongoose.Schema.ObjectId},
  startupType: String,
  isSubmitted: {type: boolean, default: false}
});

module.exports = mongoose.model("executiveSummary", summarySchema);