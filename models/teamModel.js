

var mongoose = require('mongoose');


var teamSchema = new mongoose.Schema({
  teamLeader: {type: mongoose.Schema.ObjectIs, ref:"user"},
  teamMembers:[
    {type: mongoose.Schema.ObjectId, ref:"user"}
  ]
});

module.exports = mongoose.model('team', teamSchema);