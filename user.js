// Imports

var express = require("express");
var passport = require('passport');

// Databases
var User = require("./models/userModel");
var Team = require("./models/teamModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
var Competition = require("./models/competition");

// Router
var router = express.Router();


// ===========
// Middlewares
// ===========
// Check if a user is logged in
function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		if(req.user.isAdmin===true)
			return res.redirect("/admin");
		else
			return next();
	}
	console.log(req.user, " not logged in!");
	res.redirect("/login/?ref=" + req.originalUrl);
}

// Check if a user is logged out
function isNotLoggedIn(req, res, next){
	if(!req.isAuthenticated())
		return next();
	else
		return res.redirect("/");
}

function pathExtractor(req) {
  // Escaping user input to be treated as a literal 
  // string within a regular expression accomplished by 
  // simple replacement
  function escapeRegExp(str) {
   return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  }
  // Replace utility function
  function replaceAll(str, find, replace) {
   return str.replace(new RegExp(escapeRegExp(find), 'g'), replace); 
  }
  return replaceAll(req.get('referer'), req.get('origin'), '');
}


// ==========
// User route
// ==========

// Profile page
router.get("/user", isLoggedIn, async function (req, res) {
	var events = await Event.find({});
	var competition = await Competition.findOne({});	
	var userFound=false;
	
	// Check if user registered for Presente Vous
	competition.users.forEach(function(user){
		if(String(user)===String(req.user._id))
			userFound=true;
			return;
	});

	// Check is user is in a team
	if(req.user.teamId!==null){

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


// Register page
router.get("/user/register", isNotLoggedIn, function (req, res) {
	res.render("reg_page", {messages: req.query.error});
});

// Register new user
router.post("/user/register", function (req, res) {
	
	var ref = pathExtractor(req)
	console.log('User reg Ref:', ref);
	// Check main fields
	if (!req.body.username || !req.body.password || !req.body.email){
		res.redirect(ref+"?error="+"Username, password and email are required fields!");
	}

	// TODO: Add gender too
	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		contact: req.body.phone,
		age: req.body.age
	});

	// Register user
	User.register(user, req.body.password, function (err) {
		if (err) {
			console.log("User register error: ", err);
			res.redirect(ref+"?error="+err.message);
		} else {
			console.log("[+] User Registered:", req.user.username);

			// If admin has registered a user, then DO NOT go to user profile
			if(!req.isAuthenticated() && req.user.isAdmin === false){
				passport.authenticate("local")(req, res, function () {
					res.redirect("/user");
				});
			} else if(req.user.isAdmin === true) {
				res.redirect("/admin");
			}
		}
	});

});


// Update User Summary
router.put("/user/summary", function (req, res) {
	// Check important fields
	if ((req.body.teamId == '') || (req.body.startupName == '') || (req.body.startupType == '')) {
		return res.send("Error: Empty Fields not allowed!");
	}

	// Check team status
	if (!req.body.teamId)
		return res.send("Error: Need to be in a team!");

	var details = {
		teamId: req.body.teamId,
		startupName: req.body.startupName,
		startupType: req.body.startupType,
		isSubmitted: false,
		executiveSummary: req.body.executiveSummary
	};

	// Find and update summary, if summary doesnt exist, it will be made automatically
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
		else if(summary.isSubmitted)
			return res.send("Error: Cannot update a submitted summary! Contact Admin!");
		// update existing summary
		else
			await Summary.findOneAndUpdate({
				teamId: req.user.teamId
			}, {
				$set: details
			});
	});
	res.send("OK");
	// Check if the startUp type is in the given options
});


module.exports = router;