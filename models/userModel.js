// If you get username {: null} duplicatin error, DROP the database
var mongoose = require("mongoose");
var passportLocalMongoose = require("passport-local-mongoose");
// TODO: Add Validator
// TODO: Add college field
var userSchema = new mongoose.Schema({
  firstName:      {type: String, lowercase: true, required: true},
  lastName:       {type: String, lowercase: true, required: true},
  email:          {type: String, lowercase: true, required: true},
  username: String,
  contact: Number,
  password: String,
  age:Number,
  dateRegistered: {type: Date, default: Date.now},
  interestedFields: [{type: String}],
  events:[{type: mongoose.Schema.ObjectId, ref:"event"}],
  isAdmin: {type: Boolean, default:false},
  college: String,
  teamMembers: [{type: mongoose.Schema.ObjectId, ref:"user"}]
});
userSchema.plugin(passportLocalMongoose);

// var userSchema = new mongoose.Schema({
//   username: String,
//   password: String
// });
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('user', userSchema);