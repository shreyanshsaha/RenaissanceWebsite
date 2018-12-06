var mongoose = require("mongoose");

//! SHOULD NOT BE CHANGED
var feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  feedbackText: String
});

module.exports = mongoose.model('feedback', feedbackSchema);
//! SHOULD NOT BE CHANGED