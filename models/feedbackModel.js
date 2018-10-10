var mongoose = require("mongoose");


var feedbackSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  feedbackText: String
})

module.exports = mongoose.model('feedback', feedbackSchema);