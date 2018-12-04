// =======
// Imports
// =======
var express = require("express");
var router = express.Router();
var User = require("./models/userModel");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Team = require("./models/teamModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");


// ===========
// Middlewares
// ===========

function isAdmin(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin === true)
		return next();
	res.redirect("/login?ref=/admin");
}

router.use(isAdmin);

// ===========
// Admin pages
// ===========

// Main Admin Page
router.get("/admin", async function (req, res) {
	var events1 = await User.find();
	return res.render("admin_page", { events1: events1 });
});

// Delete any user
router.get('/admin/delete/:id', async function (req, res) {
	User.remove({ _id: req.params.id, isAdmin: false }, function (err, deledata) {
		res.redirect("/admin");
	});
});

module.exports = router;
