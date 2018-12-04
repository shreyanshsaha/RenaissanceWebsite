
var express = require("express");
var router = express.Router();
var Event = require("./models/eventModel");
var passport = require('passport');

//! Debug only
var sponsorDetails=[
	{
		type:"Startup Ecosystem Partners",
		imageUrl:[
			"/images/sponsors/startup1.jpg",
			"/images/sponsors/startup2.jpg",
			"/images/sponsors/startup3.jpg",
			"/images/sponsors/startup4.jpg",
			"/images/sponsors/startup5.jpg",
			"/images/sponsors/startup6.jpg"
		]
	},
	{
		type:"Knowlege Partners",
		imageUrl:[
			"/images/sponsors/knowledge1.jpg",
			"/images/sponsors/knowledge2.jpg",
			"/images/sponsors/knowledge3.jpg"
		]
	},
	{
		type:"Technology Partners",
		imageUrl:[
			"/images/sponsors/tech1.jpg",
			"/images/sponsors/tech2.jpg"
		]
	},
	{
		type:"Event Partners",
		imageUrl:[
			"/images/sponsors/event1.jpg",
			"/images/sponsors/event2.jpg"
		]
	},
	{
		type:"Audio Partners",
		imageUrl:[
			"/images/sponsors/audio1.jpg"
		]
	},
	{
		type:"Media Partners",
		imageUrl:[
			"/images/sponsors/media1.jpg",
			"/images/sponsors/media2.jpg",
			"/images/sponsors/media3.jpg",
			"/images/sponsors/media4.jpg",
			"/images/sponsors/media5.jpg"
		]
	}
];
//! Debug end



// ===========
// Middlewares
// ===========
router.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log("Not logged in!");
	res.redirect("/login?ref="+req.originalUrl);
}



// ===========
// Root Routes
// ===========

// Root
router.get("/", function (req, res) {
	Event.find({}, function(err, events){
		if(err)
			console.log(err);
		else
			res.render("home", { events: events });
	});
});

// Past Sponsors
router.get("/sponsors", function(req, res){
	res.render("sponsors", {sponsors: sponsorDetails});
});

// ! Executive Summary - TO BE DELETED
// router.get("/executiveSummary", isLoggedIn, function(req, res){
// 	Team.findOne({_id: req.user.teamId}).populate("teamMembers").exec(async function(err, team){
// 		if(err)
// 			return res.send(err);

// 		if(team){
// 			var summary = await Summary.findOne({teamId: req.user.teamId});
// 			console.log(summary);
// 			if(summary)
// 				res.render("summary", {teamMembers: team.teamMembers, teamLeader: team.teamLeader.toString(), summary: summary});
// 			else
// 			res.render("summary", {teamMembers: team.teamMembers, teamLeader: team.teamLeader.toString(), summary: null});
// 		}
// 		else
// 		res.render("summary", {teamMembers: null, teamLeader: null, summary: null});
// 	});
// });



// Feedback
router.post("/feedback", function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var message = req.body.feedbackMsg;
	var subject = req.body.subject;
	if(name==='' || email==='' ||message===''){
		res.send("ERROR: Field is empty");
		return;
	}
	var newfeedback = {
		name: name,
		email: email,
		feedbackText: message,
		subject:subject
	};

	Feedback.create(newfeedback, function(err, feedback){
		if(err){
			console.log(err);
			res.send("ERROR: Feedback could not be submitted");
		}
		else{
			console.log(newfeedback);
			res.send("SUCCESS");
		}
	});
});

// Login and Logout
router.get("/login", function (req, res) {
	console.log(req.query.ref);
	var error=null;
	if(req.query.error)
		error=req.query.error;

	res.render("login", {reference:req.query.ref, error: error});
});

router.post("/login", passport.authenticate("local", 
	{
		failureRedirect: "/login?ref=&error="+'Error: User doesnt exist!'
	}), function (req, res) {
		console.log(req.user.username, " logged in!");
		if(req.body.reference)
			res.redirect(req.body.reference);
		else
			res.redirect("/user");
});

router.get("/logout", isLoggedIn, function (req, res) {
	console.log("Logout: ", req.user.username);
	req.logout();
	res.redirect("/");
});



module.exports = router;