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

// ===========
// Middlewares
// ===========
/*
function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin === true)
		return next();
	res.redirect("/login?ref=/admin");
}

router.use(isAdmin);
*/
// ===========
// Admin pages
// ===========

// Main Admin Page
router.get("/admin", async function (req, res) {
	var user = await User.find().populate(" teamId");
	return res.render("admin_page", { user: user });
});

// Delete any user
router.get('/admin/delete/:id',async function (req, res) {
	User.remove({ _id: req.params.id, isAdmin: false }, function (err, deledata) {
		res.redirect("/admin");
	});
});
//team deletion module by admin
router.get("/admin", async function (req, res) {
	var team = await Team.find().populate("teamMembers");

	return res.render("admin_page", { team: team });
});


module.exports = router;
