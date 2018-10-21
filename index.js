// =========
// Includes
// =========
var express = require('express'),
	bodyParser = require('body-parser'),
	User = require('./models/userModel'),
	Feedback = require('./models/feedbackModel'),
	Event = require("./models/eventModel"),
	mongoose = require('mongoose'),
	passport = require('passport'),
	LocalStrategy = require('passport-local');

var rootRoute = require("./root"),
		userRoute = require("./user"),
		adminRoute = require("./admin");


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
app.use(rootRoute);
app.use(userRoute);
app.use(adminRoute);











app.post("/register/event/:id", async function(req, res){
	var event = await Event.findById(req.params.id);

	if(!req.isAuthenticated())
		res.send("Error You need to Log in!");
	else if(!event)
		res.send("Error Wrong event ID!");
	else if(event.teamRequired===true && req.user.teamMembers.length<=0)
		res.send("Error Need a team to register! Check profile");
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


app.listen(80, function () {
	console.log("Server has started!");
});
// app.listen(process.env.PORT, process.env.IP);
