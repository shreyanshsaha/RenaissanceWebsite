// =======
// Imports
// =======
var express = require("express");
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');

// ========
// Database
// ========
var User = require("./models/userModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
var Team = require("./models/teamModel");
var middleware = require("./middleware");

// router.use(isAdmin);

// ===========
// Admin pages
// ===========

// Main Admin Page
<<<<<<< HEAD
router.get("/admin", isAdmin,async function (req, res) {
	var user = await User.find().populate("teamId");
	var team = await Team.find().populate("teamMembers");

	var leader = await Team.find({},{teamLeader:1,_id:0}).populate("teamLeader");
	return res.render("admin_page", { team: team ,user:user,leader:leader,team1:team1});
});

// Delete any user
router.get('/admin/delete/:id',isAdmin,async function (req, res) {
=======
router.get("/admin", middleware.isAdmin, async function (req, res) {
	var events1 = await User.find();
	return res.render("admin_page", { events1: events1, messages:req.query.error });
});

// Delete any user
router.get('/admin/delete/:id', middleware.isAdmin, async function (req, res) {
>>>>>>> origin/master
	User.remove({ _id: req.params.id, isAdmin: false }, function (err, deledata) {
		res.redirect("/admin");
	});
});
//team deletion module by admin
/*
router.get("/admin/deleteleader/:id", async function (req, res) {
	Team.deleteOne({_id: req.params.id}, async function(err, deletedTeam){
		// Delete its executive summary
		await Summary.deleteOne({teamId: req.params.id})
		.catch((err)=>{
			return res.send(err);
		});


	});

});*/


module.exports = router;
