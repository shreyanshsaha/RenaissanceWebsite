


var express = require("express");
var router = express.Router();
var User = require("./models/userModel");
var passport = require('passport');
var LocalStrategy = require('passport-local');
var Team = require("./models/teamModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
// ===========
// Admin pages
// ===========

//function isAdmin(req, res, next){
//	if(req.isAuthenticated() && req.user.isAdmin===true)
//			return next();
//	res.redirect("/admin_page");
//}


// Show all registered users
router.get("/admin/admin_page", async function(req, res){
	var events1 =await User.find({});
		return	res.render("admin_page",{events1:events1});

});

// Show all registrations in events


module.exports = router;
