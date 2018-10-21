var express=require("express");
var router = express.Router();
var User = require("./models/userModel");
var passport = require('passport');
var LocalStrategy = require('passport-local');

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.user, " not logged in!");
	res.redirect("/login");
}

// User route
router.get("/user", isLoggedIn, function (req, res) {
	User.findOne({username: req.user.username}).populate("events").populate("teamMembers").exec(function(err, userDetails){
		if(err)
			console.log(err);
		else{
			res.render("profile", {user: userDetails});
		}
	});
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