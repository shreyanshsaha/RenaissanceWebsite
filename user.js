// Imports
var express = require("express");
var passport = require('passport');
var middleware = require("./middleware")
var mongoose = require("mongoose");
// Databases
var User = require("./models/userModel");
var Team = require("./models/teamModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
var Competition = require("./models/competition");
var Questionnaire = require("./models/questionnaire");
var Bussiness = require("./models/ideationBusinessModel");
var Social = require("./models/ideationSocialModel");
var Operational = require("./models/operationalModel");

// Router
var router = express.Router();


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
router.get("/user", middleware.isLoggedIn, async function (req, res) {
	var events = await Event.find({});
	var competition = await Competition.findOne({});
	var userFound = false;

	// Check if user registered for Presente Vous
	competition.users.forEach(function (user) {
		if (String(user) === String(req.user._id))
			userFound = true;
		return;
	});

	// Check is user is in a team
	if (req.user.teamId !== null) {

		var team = await Team.findOne({ _id: req.user.teamId }).populate("teamMembers")
			.catch(err => {
				console.log(err);
			});

		var summary = await Questionnaire.findOne({ teamId: req.user.teamId });
		console.log("Summary:", summary);

		var typeSelected = false;
		if (req.user.questionnaire)
			typeSelected = true;

		if (summary) {
			var type = summary.type;
			if (type === 'bussiness')
				summary = await Bussiness.findOne({ _id: mongoose.Types.ObjectId(summary.q_id) })
			else if (type === 'social')
				summary = await Social.findOne({ _id: mongoose.Types.ObjectId(summary.q_id) })
			else if (type === 'operational')
				summary = await Operational.findOne({ _id: mongoose.Types.ObjectId(summary.q_id) })
			if(!summary)
				return res.render("profile_page", { team: team, summary: null, teamLeader: team.teamLeader, events: events, competition: { name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound } });
			
			summary.type = type;
			console.log(summary);
			return res.render("profile_page", { team: team, summary: summary, teamLeader: team.teamLeader, events: events, competition: { name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound } });
		} else {
			return res.render("profile_page", { team: team, summary: null, teamLeader: team.teamLeader, events: events, competition: { name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound } });
		}
	}
	else
		return res.render("profile_page", { team: null, summary: null, teamLeader: null, events: events, competition: { name: competition.name, description: competition.description, _id: competition._id, userRegistered: userFound } });
});

// Register page
router.get("/user/register", middleware.isNotLoggedIn, function (req, res) {
	res.render("reg_page", { messages: req.query.error });
});

// Register new user
router.post("/user/register", function (req, res) {

	var ref = pathExtractor(req)
	console.log('User reg Ref:', ref);
	// Check main fields
	if (!req.body.username || !req.body.password || !req.body.email) {
		res.redirect(ref + "?error=" + "Username, password and email are required fields!");
	}

	var user = new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username,
		contact: req.body.phone,
		age: req.body.age,
		gender: req.body.genderRadio
	});

	console.log(user);

	// Register user
	User.register(user, req.body.password, function (err) {
		if (err) {
			console.log("User register error: ", err);
			res.redirect(ref + "?error=" + err.message);
		} else {
			console.log("[+] User Registered:", req.body.username);

			// If admin has registered a user, then DO NOT go to user profile
			if (!req.isAuthenticated()) {
				passport.authenticate("local")(req, res, function () {
					res.redirect("/user");
				});
			} else if (req.user.isAdmin === true) {
				res.redirect("/admin");
			}
		}
	});

});


module.exports = router;