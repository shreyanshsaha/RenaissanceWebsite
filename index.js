// =========
// Includes
// =========
var express = require('express'),
	seedDB = require('./seed'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	Feedback = require('./models/feedbackModel'),
	Event = require("./models/eventModel"),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local');



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

function isAdmin(req, res, next){
	if(req.isAuthenticated() && req.user.isAdmin===true)
			return next();
	res.redirect("/");
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

app.post("/register/event/:id", async function(req, res){
	var event = await Event.findById(req.params.id);

	if(!req.isAuthenticated())
		res.send("Error You need to Log in!");
	else if(!event)
		res.send("Error Wrong event ID!");
	else if(event.teamRequired===true && req.user.teamMembers.length<=0)
		res.send("Error Need a team to register!");
	else{
		// Add event to user
		await User.findOneAndUpdate( {username: req.user.username}, {$addToSet: {events:req.params.id}})
		.catch((err)=>{console.log(err);});

		// If event is team event, register everyone
		if(event.teamRequired)
			await req.user.teamMembers.forEach((memberID)=>{
				User.findOneAndUpdate({_id: memberID}, {$addToSet: {events:req.params.id}});
			});

		// Add user to event
		await Event.findOneAndUpdate({_id: req.params.id}, {$addToSet: {users: req.user.id}});
		// If it is a team event, register everyone
		if(event.teamRequired)
			await Event.findOneAndUpdate({_id: req.params.id}, {$addToSet: {users: req.user.teamMembers}});
		res.send("SUCCESS");
	}
});

// ===========
// Admin pages
// ===========

// Show all registered users
app.get("/admin/show", isAdmin, function(req, res){
	User.find({}, function(err, allUsers){
		if(err)
			console.log(err);
		else
			res.send(allUsers);
	});
});

// Show all registrations in events
app.get("/admin/showRegistrations", isAdmin, function(req, res){
	Event.find({}, function(err, allEvents){
		res.send(allEvents);
	});
});


// Login and Logout
app.get("/login", function (req, res) {
	res.render("login");
});

app.post("/login", passport.authenticate("local", {
	successRedirect: "/",
	failureRedirect: "/login"
}), function (req, res) {});

app.get("/logout", isLoggedIn, function (req, res) {
	console.log("Logout: ", req.user.username);
	req.logout();
	res.redirect("/");
});

app.get("/profile", isLoggedIn, function (req, res) {
	User.findOne({username: req.user.username}).populate("events").populate("teamMembers").exec(function(err, userDetails){
		if(err)
			console.log(err);
		else{
			res.render("profile", {user: userDetails});
		}
	});
});

app.post("/addTeamMember", function(req, res){
	var teamUsername = req.body.teamUsername;
	console.log("Username", teamUsername);
	if(teamUsername === req.user.username)
		res.send("Error: Cannot add self");
	else if(!teamUsername || teamUsername.length<=0)
		res.send("Error: Username cannot be empty");
	else
		User.findOne({"username": teamUsername}, async function(err, user){
			console.log(err);
			if(err)
				res.send(err);
			else if(user.teamMembers.length>0)
				res.send("Error: User already in a team!");
			else if(req.user.teamMembers.length>=4)
				res.send("Error: User limit reached!");
			else
				if(!user)
					res.send("Error: User doesnt Exist!");
				else{
					// Add users to each others teams
					await User.findOneAndUpdate({"username": req.user.username}, {$addToSet: {"teamMembers": user._id}});
					await User.findOneAndUpdate({"_id": user._id}, {$addToSet: {"teamMembers": req.user._id}});
					res.send(user.username);
				}
		});
});

app.post("/deleteAllMembers", isLoggedIn, async function(req, res){
	// Remove user from everones team
	await req.user.teamMembers.forEach(function(teamId){
		User.findOneAndUpdate({_id: teamId}, {$pull: {teamMembers: req.user._id}}, function(err){
			console.log(err);
		});
	});

	// Clear the users team
	User.findOneAndUpdate({_id: req.user._id}, {$set: {teamMembers: []}}, function(err, newUser){
		if(err)
			res.send(err);
		else
			res.send(newUser);
	});
});

app.post("/deleteMember", async function(req, res){
	// Delete members from each others table
	var user1 = await User.findOneAndUpdate({_id: req.body.teamMember}, {$pull: {teamMembers: req.user._id}});
	console.log(user1);
	await User.findOneAndUpdate({_id: req.user._id}, {$pull: {teamMembers: req.body.teamMember}});
	res.send("Success");
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

app.listen(80, function () {
	console.log("Server has started!");
});
// app.listen(process.env.PORT, process.env.IP);
