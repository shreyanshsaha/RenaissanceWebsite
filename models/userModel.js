var mongoose = require("mongoose");

// TODO: Add Validator

var userSchema = new mongoose.Schema({
  firstName:      {type: String, lowercase: true, required: true},
  lastName:       {type: String, lowercase: true, required: true},
  email:          {type: String, lowercase: true, required: true},
  registrationNo: {type: String, lowercase: true, required: true},
  contact: Number,
  dateRegistered: {type: Date, default: Date.now},
  interestedFields: [{type: String}]
});

module.exports = mongoose.model('user', userSchema);