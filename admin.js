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
var Bussiness = require("./models/ideationBusinessModel");
var Social = require("./models/ideationSocialModel");
var Operational = require("./models/operationalModel");
var Questionnaires = require("./models/questionnaire");

// router.use(isAdmin);

// ===========
// Admin pages
// ===========

// Main Admin Page
router.get("/admin", middleware.isAdmin, async function (req, res) {
	var events1 = await User.find();
	var bussiness = await Bussiness.find();
	var social = await Social.find();
	var operational = await Operational.find();
	var questionnaires = await Questionnaires.find();
	return res.render("admin_page", { events1: events1, messages:req.query.error, bussiness:bussiness, social: social, operational: operational, qlength: questionnaires.length});
});

// Delete any user
router.get('/admin/delete/:id', middleware.isAdmin, async function (req, res) {
	User.remove({ _id: req.params.id, isAdmin: false }, function (err, deledata) {
		res.redirect("/admin");
	});
});

module.exports = router;
