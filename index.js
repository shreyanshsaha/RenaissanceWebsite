var express = require('express'),
	seedDB = require('./seed'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local');

var app = express();
// mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp
// mongoose.connect("mongodb://localhost/renaissance");
mongoose.connect("mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp");
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: false
}))

// PASSPORT CONFIGURATION
app.use(require("express-session")({
	secret: "Renaissance Website VIT!",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ===========
// Middlewares
// ===========
app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	next();
});

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log(req.user, " not logged in!");
	res.redirect("/login");
}

// Seed the database
seedDB();

// ======
// Routes
// ======

//! Debug only
var eventDetails = [
	{
		eventName: "JAM",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: 'Just-A-Minute (or JAM) is an all round-fun event that is all about the control of the mind over the mouth. Can you make it through sixty seconds of non-stop talking without hesitation, repetition, or deviation? Or will the sheer pressure make you crumble and have your competitors pounce on you in an instant?',
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "Anatomy &amp Physiology",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: 'This event encompasses the anatomy and physiology of selected body systems, this year limited to nervous and endocrine systems and sense organs.',
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "Hovercraft",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: 'Competitors may construct a self-propelled air-levitated vehicle with up to two battery-powered motors that turn one propeller each to levitate and move the vehicle down a track. Competitors must also be tested on their knowledge of classic mechanics and related topics.',
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "Scrambler",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: 'Competitors must design, build and test a mechanical device which uses the energy from a falling mass to transport an egg along a track as quickly as possible and stop as close to the center of a terminal barrier without breaking the egg.',
		eventImgSrc:"/images/samplePoster.jpg"
	},

]

//! Debug end
// Root
app.get("/", function (req, res) {
	res.render("home", { events: eventDetails });
});

// Register
app.get("/register", function (req, res) {
	res.render("reg_page", {
		messages: undefined
	});
});

app.post("/register", function (req, res) {
	User.register(new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		username: req.body.username
	}), req.body.password, function (err, newUser) {
		if (err) {
			console.log(err);
			res.send(err);
		} else {
			console.log("[+] User Registered:", newUser);
			passport.authenticate("local")(req, res, function () {
				res.redirect("/");
			});
		}
	});
});


// Login and Logout
app.get("/login", function (req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/register",
}), function (req, res) {});

app.get("/logout", isLoggedIn, function (req, res) {
	// console.log("Logout: ", req.currentUser.username);
	req.logout();
	// res.send("Logged Out!");
	res.redirect("/");
});

app.get("/profile", isLoggedIn, function (req, res) {
	res.send("User logged in!" + JSON.stringify(req.user));
})


//! Debug Routes Remove them in release
app.get("/getAllStudent", function (req, res) {
	User.find({}, function (err, users) {
		if (err)
			console.log(err);
		else
			res.send(users);
	})
});

app.get("/events", function (req, res) {
	res.render("eventname");
});

// app.listen(80, function () {
// 	console.log("Server has started!");
// })
app.listen(process.env.PORT, process.env.IP);