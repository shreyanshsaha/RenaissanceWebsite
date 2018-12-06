// =======
// Imports
// =======
var express = require("express");
var methodOverride = require('method-override');
// ========
// Database
// ========
var Event = require("./models/eventModel");
var User = require("./models/userModel");
var Competition = require("./models/competition");

// Router
var router = express.Router();
router.use(methodOverride("_method"));


// Register user to event
router.post("/register/event/:id", async function(req, res){
	var event = await Event.findById(req.params.id);

	if(!req.isAuthenticated())
		res.send("Error You need to Log in!");
	else if(!event)
		res.send("Error Wrong event ID!");
	else if(event.teamRequired===true && req.user.teamMembers.length<=0)
		res.send("Error Need a team to register! Check profile");
	else{
		// Add event to user
		await User.findOneAndUpdate( {username: req.user.username}, {$addToSet: {events:req.params.id}})
		.catch((err)=>{console.log(err);});

		// If event is team event, register everyone
		if(event.teamRequired)
			await req.user.teamMembers.forEach((memberID)=>{
				User.findOneAndUpdate({_id: memberID}, {$addToSet: {events:req.params.id}});
			});

		// Add user to event
		await Event.findOneAndUpdate({_id: req.params.id}, {$addToSet: {users: req.user.id}});
		// If it is a team event, register everyone
		if(event.teamRequired)
			await Event.findOneAndUpdate({_id: req.params.id}, {$addToSet: {users: req.user.teamMembers}});
		res.send("SUCCESS");
	}
});

// Register user to presente vouss
router.put("/register/competition/:id", async function(req, res){
	console.log("Register CAlled!");
	if(!req.isAuthenticated())
		return res.send("Error: Need to login to register!");
	
	var competition = await Competition.findOne({_id: req.params.id});
	if(!competition)
		return res.send("Error: Competition doesnt exist!");

	// Register user for competition
	await User.findOneAndUpdate( {username: req.user.username}, {$set: {registeredForCompetition: true}})
		.catch((err)=>{console.log(err);});

	// Add user to competition
	await Competition.findByIdAndUpdate({_id: req.params.id}, {$addToSet: {users: req.user._id}})
	.catch((err)=>{console.log(err);});

	return res.send("Success!");
});


module.exports = router;
