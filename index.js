// =========
// Includes
// =========
var express = require('express'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	Event = require("./models/eventModel"),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local'),
	Team = require("./models/teamModel"),
	methodOverride = require('method-override'),
	Competition = require("./models/competition");

var rootRoute = require("./root"),
		userRoute = require("./user"),
		adminRoute = require("./admin"),
		registerRoute = require("./register"),
		teamRoute = require("./team");


// ===============================
// Setting up express and database
// ===============================
var app = express();
mongoose.connect("mongodb://localhost/renaissance", {useNewUrlParser: true});
// mongoose.connect("mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp", {useNewUrlParser: true});
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



app.listen(80, function () {
	console.log("Server has started!");
});
// app.listen(process.env.PORT, process.env.IP);


