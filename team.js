var Team = require("./models/teamModel");
var router = require('express').Router();

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated()) {
		return next();
	}
	console.log("Not logged in!");
	res.redirect("/login");
}


router.post("/team/new", isLoggedIn, async function(req, res){
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

router.put("/team/exit", isLoggedIn, function(req, res){
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
router.post("/team/add/:username", isLoggedIn, function(req, res){
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
		else if(req.params.username === req.user.username)
			return res.send("Error: Cannot add self!");
		else if(!(teamUser.teamId === null))
			return res.send("Error: User already in a team!");
		// Check if user has registered for presente vous or not
		var competition = await Competition.findOne({});
		console.log(competition);
		var userFound=false;
		competition.users.forEach(function(user){
			if(String(user)===String(teamUser._id)){
				userFound=true;
				return;
			}
		});

		if(!userFound)
			return res.send("Error: Member needs to register for Presente vous!");
		// Add user to team list
		await Team.updateOne({_id: req.user.teamId}, {$addToSet: {teamMembers: teamUser._id}});
		await User.findOneAndUpdate({_id: teamUser._id}, {$set: {teamId: req.user.teamId}});
		return res.send("User Added!");
	});
});

// Delete complete team, only team leader can delete the team
router.delete("/team/:id", async function(req, res){
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




router.post("/team/delete/user", function(req, res){
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


module.exports = router;