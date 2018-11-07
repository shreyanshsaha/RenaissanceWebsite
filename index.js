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
	LocalStrategy = require('passport-local'),
	Team = require("./models/teamModel"),
	methodOverride = require('method-override'),
	Competition = require("./models/competition");

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



function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log("Not logged in!");
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

app.put("/register/competition/:id", async function(req, res){
	if(!req.isAuthenticated())
		return res.send("Error: Need to login to register!");
	
	var competition = await Competition.findOne({_id: req.params.id});
	if(!competition)
		return res.send("Error: Competition doesnt exist!");

	// Register user for competition
	await User.findOneAndUpdate( {username: req.user.username}, {$set: {registeredForCompetition: true}})
		.catch((err)=>{console.log(err);});

	// Add user to competition
	await Competition.findByIdAndUpdate({_id: req.params.id}, {$addToSet: {users: req.user._id}})
	.catch((err)=>{console.log(err);});

	return res.send("Success!");
});





app.post("/team/new", isLoggedIn, async function(req, res){
	// Create a new team
	// Logic: 
	// Create a new team with the currentUser as team Leader
	// Add the ID of the new team to the user
	console.log(req.user);
	if(!(req.user.teamId === null)){
		res.send("Error: User already in a team");
		return;
	}
	console.log(req.user.username, "created a new team!");
	// Create new team
	var newTeam = await Team.create({teamLeader: req.user._id, teamMembers: [req.user._id]});
	console.log(newTeam._id);
	// Update the teamId to user
	User.findOneAndUpdate({_id: req.user._id}, {teamId: newTeam._id}, function(err, newUser){
		if(err)
			res.send(err);
		else
			res.send(newUser);
	});
});

app.put("/team/exit", isLoggedIn, function(req, res){
	console.log(req.user.username, " exited team!");
	Team.findOne({_id:req.user.teamId}, async function(err, team){
		if(err)
			return res.send("Error: "+toString(err));
		
		if(!team)
			return res.send("Error: Cannot exit a team when not in a team!");

		if(req.user._id.equals(team.teamLeader))
			return res.send("Error: Team leader cannot exit team!");

		// Pull member from the team
		// Clear the teamID for the member
		await User.findOneAndUpdate({_id: req.user._id}, {$set: {teamId: null}});
		await Team.findByIdAndUpdate({_id: team._id}, {$pull: {teamMembers: req.user._id}});
		res.send("Success");
	});
});

// Add new user to team
app.post("/team/add/:username", isLoggedIn, function(req, res){
	// Logic:
	// Check if user is already in a team
	// Add this user to the same team as team ID
	if(req.user.teamId===null)
		return res.send("Error: Create team first!");
	
	User.findOne({username: req.params.username}, async function(err, teamUser){
		if(err)
			return res.send(err);
		else if(!teamUser)
			return res.send("Error: User doesnt Exist!");
		else if(req.params.username === currentUser.username)
			return res.send("Error: Cannot add self!");
		else if(!(teamUser.teamId === null))
			return res.send("Error: User already in a team!");
		// Check if user has registered for presente vous or not
		if(teamUser.competitions.length<=0)
			return res.send("Error: Member needs to register for Presente vous!");
		// Add user to team list
		await Team.updateOne({_id: req.user.teamId}, {$addToSet: {teamMembers: teamUser._id}});
		await User.findOneAndUpdate({_id: teamUser._id}, {$set: {teamId: req.user.teamId}});
		return res.send("User Added!");
	});
});

// Delete complete team, only team leader can delete the team
app.delete("/team/:id", async function(req, res){
	// logic:
	// Remove teamId from all teamMembers

	var team = await Team.findOne({_id: req.params.id});
	console.log(team.teamLeader);
	// Check is leader is deleting it 
	//! Not working
	if(team.teamLeader.equals(req.user._id)){
		// Delete teamID from all users
		await team.teamMembers.forEach(function(member){
			console.log("Member", member);
			User.updateOne({_id: member}, {$set: {teamId: null}}, function(err){
				console.log(err);
			});
		});

		// Delete the team
		Team.deleteOne({_id: req.params.id}, function(err, deletedTeam){
			if(err)
				res.send(err);
			else
				res.send("Deleted Team");
		});
	}
	else{
		res.send("Error: only team leader can delete a team!");
	}
});




app.post("/team/delete/user", function(req, res){
	// Delete members from each others table
	if(!req.user.teamId)
		return res.send("Error: User not in a team!");
	Team.findOne({"_id": req.user.teamId}, async function(err, team){
		console.log("team: ", team);
		// Check if user is team leader
		if(err)
			return res.send("Error: " + toString(err));

		// Doesnt work in same browser
		if(req.user._id.equals(team.teamLeader)){
			// Delete the teamId from the user
			console.log(req.user.username, req.user._id, team.teamLeader);
			console.log(mongoose.Schema.Types.ObjectId(req.user._id) === mongoose.Schema.Types.ObjectId(team.teamLeader));
			res.send("OK");

			// await User.findOneAndUpdate({_id: req.body.teamMember}, {$set: {teamId: null}});
			// await Team.findOneAndUpdate({_id: team._id}, {$pull:{teamMembers: req.body.teamMember}});
			// // Pull the member from the team

			// return res.send("Success");
		}
		else{
			return res.send("Error: Only team leader can delete members!");
		}
	});
});



// app.post("/deleteAllMembers", isLoggedIn, async function(req, res){
// 	// Remove user from everones team
// 	await req.user.teamMembers.forEach(function(teamId){
// 		User.findOneAndUpdate({_id: teamId}, {$pull: {teamMembers: req.user._id}}, function(err){
// 			console.log(err);
// 		});
// 	});

// 	// Clear the users team
// 	User.findOneAndUpdate({_id: req.user._id}, {$set: {teamMembers: []}}, function(err, newUser){
// 		if(err)
// 			res.send(err);
// 		else
// 			res.send(newUser);
// 	});
// });

// app.post("/addTeamMember", function(req, res){
// 	var teamUsername = req.body.teamUsername;
// 	console.log("Username", teamUsername);
// 	if(teamUsername === req.user.username)
// 		res.send("Error: Cannot add self");
// 	else if(!teamUsername || teamUsername.length<=0)
// 		res.send("Error: Username cannot be empty");
// 	else
// 		User.findOne({"username": teamUsername}, async function(err, user){
// 			console.log(err);
// 			if(err)
// 				res.send(err);
// 			else if(user.teamMembers.length>0)
// 				res.send("Error: User already in a team!");
// 			else if(req.user.teamMembers.length>=4)
// 				res.send("Error: User limit reached!");
// 			else
// 				if(!user)
// 					res.send("Error: User doesnt Exist!");
// 				else{
// 					// Add users to each others teams
// 					await User.findOneAndUpdate({"username": req.user.username}, {$addToSet: {"teamMembers": user._id}});
// 					await User.findOneAndUpdate({"_id": user._id}, {$addToSet: {"teamMembers": req.user._id}});
// 					res.send(user.username);
// 				}
// 		});
// });



app.listen(80, function () {
	console.log("Server has started!");
});
// app.listen(process.env.PORT, process.env.IP);


