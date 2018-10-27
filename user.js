var express=require("express");
var router = express.Router();
var User = require("./models/userModel");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Team = require("./models/teamModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.user, " not logged in!");
	res.redirect("/login/?ref="+req.originalUrl);
}

// User route
router.get("/user", isLoggedIn, async function (req, res) {
	
	var user = await User.findOne({_id: req.user.username}).populate("events").populate("teamMembers")
	.catch(err=>{
		return err;
	});
	var events = await Event.find({});
	if(req.user.teamId!=null){
		var team = await Team.findOne({_id: req.user.teamId}).populate("teamMembers")
		.catch(err=>{
			console.log(err);
		});
		var summary = await Summary.findOne({_id: req.user.teamId});
		if(summary)
			return res.render("profile_page", { team: team, summary:summary, teamLeader: team.teamLeader, events:events});
		return res.render("profile_page", { team: team, summary:null, teamLeader: team.teamLeader, events:events});
	}
	else
		return res.render("profile_page", { team: null, summary:null, teamLeader: null, events:events});
	
});

router.get("/user/register", function (req, res) {
	res.render("reg_page", {messages: undefined});
});

router.post("/user/register", function (req, res) {
	User.register(new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		contact: req.body.phone,
		age: req.body.age
	}), req.body.password, function (err, newUser) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log("[+] User Registered:");
			passport.authenticate("local")(req, res, function () {
				res.redirect("/");
			});
		}
	});
});

router.put("/user/summary", function(req, res){
	if( (req.body.teamId=='') || (req.body.startupName=='') || (req.body.startupType=='')){
		return res.send("Error: Empty Fields not allowed!");
	};
	if(!req.body.teamId)
		return res.send("Error: Need to be in a team!");
	
	var details = {
		teamId: req.body.teamId,
		startupName: req.body.startupName,
		startupType: req.body.startupType,
		isSubmitted: false,
		executiveSummary: req.body.executiveSummary
	};
	Summary.findOne({teamId: req.body.teamId}, async function(err, summary){
		if(err)
			return res.send("Error: " +err);
		// create a new sumary
		if(summary == null)
			await Summary.create(details)
			.catch(err=>{
				return res.send("Error: " +err);
			});
		// update existing summary
		else
			await Summary.findOneAndUpdate({teamId: req.user.teamId}, {$set: details});
	});
	res.send("OK");
	// Check if the startUp type is in the given
});

module.exports = router;