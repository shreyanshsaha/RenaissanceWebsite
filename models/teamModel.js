// Team is only for presente vous

var mongoose = require('mongoose');


var teamSchema = new mongoose.Schema({
  teamLeader: {type: mongoose.Schema.ObjectId, ref:"user"},
  teamMembers:[
    {type: mongoose.Schema.Types.ObjectId, ref:"user"}
  ]
});

module.exports = mongoose.model('team', teamSchema);