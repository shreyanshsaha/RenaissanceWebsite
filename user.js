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


module.exports = router;