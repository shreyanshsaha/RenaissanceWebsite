var express = require("express");
var router = express.Router();
var User = require("./models/userModel");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Team = require("./models/teamModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
var Competition = require("./models/competition");

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.user, " not logged in!");
	res.redirect("/login/?ref=" + req.originalUrl);
}

// User route
router.get("/user", isLoggedIn, async function (req, res) {
	var events = await Event.find({});
	var competition = await Competition.findOne({});
	console.log(String(req.user._id), competition.users[0]);
	
	var userFound=false;
	competition.users.forEach(function(user){
		if(String(user)===String(req.user._id))
			userFound=true;
			return;
	});

	
	console.log(req.currentUser);

	if(req.user.teamId!=null){
		var team = await Team.findOne({_id: req.user.teamId}).populate("teamMembers")
		.catch(err=>{
			console.log(err);
		});
		var summary = await Summary.findOne({_id: req.user.teamId});
		if(summary)
			return res.render("profile_page", { team: team, summary:summary, teamLeader: team.teamLeader, events:events, competition:{name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound}});
		return res.render("profile_page", { team: team, summary:null, teamLeader: team.teamLeader, events:events, competition:{name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound}});
	}
	else
		return res.render("profile_page", { team: null, summary:null, teamLeader: null, events:events, competition:{name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound}});
});

router.get("/user/register", function (req, res) {
	res.render("reg_page", {
		messages: req.query.error
	});
});

router.post("/user/register", function (req, res) {
	if (!req.body.username || !req.body.password || !req.body.email)
	res.redirect("/register?error="+"Username, password and email are required fields!");

	// Add gender too
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		contact: req.body.phone,
		age: req.body.age
	});

	User.register(user, req.body.password, function (err, newUser) {
		if (err) {
			console.log("User register error", err);
			res.redirect("/user/register?error="+err.message);
		} else {
			console.log("[+] User Registered:");
			passport.authenticate("local")(req, res, function () {
				res.redirect("/user");
			});
		}
	});

});

router.put("/user/summary", function (req, res) {
	if ((req.body.teamId == '') || (req.body.startupName == '') || (req.body.startupType == '')) {
		return res.send("Error: Empty Fields not allowed!");
	};
	if (!req.body.teamId)
		return res.send("Error: Need to be in a team!");

	var details = {
		teamId: req.body.teamId,
		startupName: req.body.startupName,
		startupType: req.body.startupType,
		isSubmitted: false,
		executiveSummary: req.body.executiveSummary
	};

	Summary.findOne({
		teamId: req.body.teamId
	}, async function (err, summary) {
		if (err)
			return res.send("Error: " + err);
		// create a new sumary
		if (summary === null)
			await Summary.create(details)
			.catch(err => {
				return res.send("Error: " + err);
			});
		// update existing summary
		else
			await Summary.findOneAndUpdate({
				teamId: req.user.teamId
			}, {
				$set: details
			});
	});
	res.send("OK");
	// Check if the startUp type is in the given
});

module.exports = router;