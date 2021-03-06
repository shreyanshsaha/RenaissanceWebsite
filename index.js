// =========
// Includes
// =========
var Competition= require('./models/competition');

var express = require('express'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	flash = require('connect-flash'),
	LocalStrategy = require('passport-local'),
	methodOverride = require('method-override');
	nodemailer = require('nodemailer');
	var session = require('express-session');
var cookieParser = require('cookie-parser');
//	var middleware = require("./middleware");
var rootRoute = require("./root"),
		userRoute = require("./user"),
		adminRoute = require("./admin"),
		registerRoute = require("./register"),
		teamRoute = require("./team"),
		internshipRoute = require("./temp");
     forgetRoute=require("./forget");
       
// ===============================
// Setting up express and database
// ===============================
var app = express();
//  mongoose.connect("mongodb://localhost/renaissance", {useNewUrlParser: true});
mongoose.connect("mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp", {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(cookieParser('secret'))

// ======================
// PASSPORT CONFIGURATION
// ======================
app.use(require("express-session")({
	secret: "Renaissance Website VIT!",
	resave: false,
	saveUninitialized: false
}));
	app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.success = req.flash('success');
	res.locals.error = req.flash('error');
	next();
});

// ======
// Routes
// ======
app.use(rootRoute);
app.use(userRoute);
app.use(adminRoute);
app.use(registerRoute);
app.use(teamRoute);
app.use(internshipRoute);
app.use(forgetRoute);

// app.listen(3000, function () {
// 	console.log("Server has started!");
// });
app.listen(process.env.PORT, process.env.IP);


