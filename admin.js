var express = require("express");
var router = express.Router();

// ===========
// Admin pages
// ===========

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin===true)
			return next();
	res.redirect("/");
}


// Show all registered users
router.get("/admin/show", isAdmin, function(req, res){
	User.find({}, function(err, allUsers){
		if(err)
			console.log(err);
		else
			res.send(allUsers);
	});
});

// Show all registrations in events
router.get("/admin/showRegistrations", isAdmin, function(req, res){
	Event.find({}, function(err, allEvents){
		res.send(allEvents);
	});
});

module.exports = router;