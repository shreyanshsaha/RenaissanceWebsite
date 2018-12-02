// =========
// Includes
// =========
var Competition= require('./models/competition');
var express = require('express'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override');

var rootRoute = require("./root"),
		userRoute = require("./user"),
		adminRoute = require("./admin"),
		registerRoute = require("./register"),
		teamRoute = require("./team");


// ===============================
// Setting up express and database
// ===============================
var app = express();
// mongoose.connect("mongodb://localhost/renaissance", {useNewUrlParser: true});
mongoose.connect("mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({
	extended: false
}));

app.use(methodOverride("_method"));

// ======================
// PASSPORT CONFIGURATION
// ======================
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



// ======
// Routes
// ======
app.use(rootRoute);
app.use(userRoute);
app.use(adminRoute);
app.use(registerRoute);
app.use(teamRoute);
var competition = {
	name: "Presente Vous",
	venue: "Vellore Institute of Technology, Chennai",
	date: "9th February, 2019",
	description: "Your pitch, your win. The stage is set, it awaits the ring of your inspiration and the voices of unique minds that aim to reach out and start out on their own. Presente Vous is the ultimate place to team up and get your start up the backing it needs. Don't fret, we also have the help you might need. Mentors to guide you through the process and shape up your ideas to perfection. Some areas of prime importance will be Technology- advances in sustainability, artificial intelligence and virtual reality to name a few, as well as Finances, Education, Health and Wellness.",
	teamRequired: true
  };

  Competition.create(competition);


app.listen(3000, function () {
	console.log("Server has started!");
});
// app.listen(process.env.PORT, process.env.IP);


