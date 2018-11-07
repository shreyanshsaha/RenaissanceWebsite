
// Schema for Presente Vous

var mongoose = require('mongoose');

// var competition = {
// 	name: "Presente Vous",
// 	venue: "Vellore Institute of Technology, Chennai",
// 	date: "9th February, 2019",
// 	description: "Your pitch, your win. The stage is set, it awaits the ring of your inspiration and the voices of unique minds that aim to reach out and start out on their own. Presente Vous is the ultimate place to team up and get your start up the backing it needs. Don't fret, we also have the help you might need. Mentors to guide you through the process and shape up your ideas to perfection. Some areas of prime importance will be Technology- advances in sustainability, artificial intelligence and virtual reality to name a few, as well as Finances, Education, Health and Wellness.",
// 	teamRequired: true
// };

// Competition.create(competition);

var competitionSchema = new mongoose.Schema({
  name: String,
  venue: String,
  date: String,
  description: String,
  users: [{type: mongoose.Schema.ObjectId, ref:"users"}],
  teamRequired: {type: Boolean, default: false}
});


module.exports = mongoose.model("competition", competitionSchema);