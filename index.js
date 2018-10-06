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
		eventDesc: "Your pitch, your win. The stage is set, it awaits the ring of your inspiration and the voices of unique minds that aim to reach out and start out on their own. Presente Vous is the ultimate place to team up and get your start up the backing it needs. Don't fret, we also have the help you might need. Mentors to guide you through the process and shape up your ideas to perfection. Some areas of prime importance will be Technology- advances in sustainability, artificial intelligence and virtual reality to name a few, as well as Finances, Education, Health and Wellness. ",
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "Anatomy &amp Physiology",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: "If all the world's a stage then the world is coming to VIT Chennai. A world full of entrepreneurs and exciting ventures. There's a change in the winds, so put your sails high and let the journey begin. This StartUp Expo is the place you want to be if you want some company along. They'll be here to showcase their fruits of labour and love, we'll be here to witness such beauty in real time.",
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "Hovercraft",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: "Education is not filling of a pail, but the lighting of the fire”.Unlike the usual round table conferences, we believe in experiencing it the right way. Around the fire, midnight, a cup of coffee and life stories, just to light up your path. Sounds exciting!Campfire conference is all about it.Networking opportunities for the young minds and a chance to hit your mentors mind right! A lifetime of an experience where you can light a fire , they can never put out!",
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "Scrambler",
		eventLocation: "MBA Amphitheater",
		eventTime: "5 pm",
		eventDate: "MONDAY,1,JANUARY",
		eventDesc: "“Speak so that you can influence the society”. Magnate moulding is an opportunity for the mentors to share the world what it takes to be an Entrepreneur. 90 minutes and you will sparkle with the fire of want to become like them in your eyes. Converting a startup in crises into a proper business plan will let you a jist of their journey. Enough to inspire you to work hard so that your dreams can come true. Come, listen, build and enjoy the feast for the soul.",
		eventImgSrc:"/images/samplePoster.jpg"
	},
	{
		eventName: "",
		eventLocation: "",
		eventTime: "",
		eventDate: "",
		eventDesc: "Open your eyes, rise and shine, suit up quirky, quiet or fine. But let us remind, do not leave your cv behind.This edition of the Internship Drive comes with the promise to let you be the best while learning from the best. Theoretical knowledge is available in plenty but application is the real decider, to get yourself a rung up on the ladder. While you may be looking at some like minds, the startups may find in you their right choice. ",
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
	res.render("front_page");
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

app.listen(8081, function () {
	console.log("Server has started!");
})
// app.listen(process.env.PORT, process.env.IP);