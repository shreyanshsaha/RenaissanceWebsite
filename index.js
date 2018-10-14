var express = require('express'),
	seedDB = require('./seed'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	Feedback = require('./models/feedbackModel'),
	Event = require("./models/eventModel"),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local');

var app = express();
// mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp
// mongoose.connect("mongodb://localhost/renaissance");
mongoose.connect("mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp", {useNewUrlParser: true});
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({
	extended: false
}));

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

// ======
// Routes
// ======

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

// Root
app.get("/", function (req, res) {
	Event.find({}, function(err, events){
		if(err)
			console.log(err);
		else
			res.render("home", { events: events });
	});
});

// Past Sponsors
app.get("/sponsors", function(req, res){
	res.render("sponsors", {sponsors: sponsorDetails});
});

// Register
app.get("/register", function (req, res) {
	res.render("reg_page", {messages: undefined});
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

app.post("/register/event/:id", function(req, res){
	if(!req.isAuthenticated()){
		res.send("ERROR: Need to login to register!");
	}
	else{
		console.log(req.params.id);
		User.findOneAndUpdate(
			{username: req.user.username}, 
			{$addToSet: {events:req.params.id}},
			function(err, res){
				if(err)
					console.log(err);
				else
					console.log(res);
			}
		);
		res.send("SUCCESS");
	}
});

// Login and Logout
app.get("/login", function (req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/register"
}), function (req, res) {});

app.get("/logout", isLoggedIn, function (req, res) {
	console.log("Logout: ", req.user.username);
	req.logout();
	res.redirect("/");
});

app.get("/profile", isLoggedIn, function (req, res) {
	res.send("User logged in!" + JSON.stringify(req.user));
});

app.post("/feedback", function(req, res){
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
		feedbackText: message
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


app.get("/events", function (req, res) {
	res.render("eventname");
});

app.listen(8081, function () {
	console.log("Server has started!");
});
// app.listen(process.env.PORT, process.env.IP);
