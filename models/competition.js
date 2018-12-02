
// Schema for Presente Vous

var mongoose = require('mongoose');


var competitionSchema = new mongoose.Schema({
  name: String,
  venue: String,
  date: String,
  description: String,
  users: [{type: mongoose.Schema.ObjectId, ref:"users"}],
  teamRequired: {type: Boolean, default: false}
});


module.exports = mongoose.model("competition", competitionSchema);
