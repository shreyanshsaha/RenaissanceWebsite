// =======
// Imports
// =======
var router = require('express').Router();
var mongoose = require("mongoose");
var middleware = require("./middleware")

// ========
// Database
// ========
var Team = require("./models/teamModel");
var User = require("./models/userModel");
var Summary = require("./models/presenteSummary");
var Questionnaire = require("./models/questionnaire");
var Competition = require("./models/competition");
var Bussiness = require("./models/ideationBusinessModel");
var Social = require("./models/ideationSocialModel");
var Operational = require("./models/operationalModel");

// ===========
// TEAM Routes
// ===========

// Create a new Team
router.post("/team/new", middleware.isLoggedIn, async function (req, res) {
	// Create a new team
	// Logic: 
	// Create a new team with the currentUser as team Leader
	// Add the ID of the new team to the user
	console.log(req.user);
	if (!(req.user.teamId === null)) {
		res.send("Error: User already in a team");
		return;
	}
	console.log(req.user.username, "created a new team!");
	// Create new team
	var newTeam = await Team.create({ teamLeader: req.user._id, teamMembers: [req.user._id] });
	console.log(newTeam._id);
	// Update the teamId to user
	User.findOneAndUpdate({ _id: req.user._id }, { teamId: newTeam._id }, function (err, newUser) {
		if (err)
			res.send(err);
		else
			res.send(newUser);
	});
});

// Exit a team
router.put("/team/exit", middleware.isLoggedIn, function (req, res) {
	console.log(req.user.username, " exited team!");
	Team.findOne({ _id: req.user.teamId }, async function (err, team) {
		if (err)
			return res.send("Error: " + toString(err));

		if (!team)
			return res.send("Error: Cannot exit a team when not in a team!");

		if (req.user._id.equals(team.teamLeader))
			return res.send("Error: Team leader cannot exit team!");

		// Pull member from the team
		// Clear the teamID for the member
		await User.findOneAndUpdate({ _id: req.user._id }, { $set: { teamId: null } });
		await Team.findByIdAndUpdate({ _id: team._id }, { $pull: { teamMembers: req.user._id } });
		res.send("Success");
	});
});

// Add new user to team
router.post("/team/add/:username", middleware.isLoggedIn, function (req, res) {
	// Logic:
	// Check if user is already in a team
	// Add this user to the same team as team ID
	if (req.user.teamId === null)
		return res.send("Error: Create team first!");

	User.findOne({ username: req.params.username }, async function (err, teamUser) {
		if (err)
			return res.send(err);
		else if (!teamUser)
			return res.send("Error: User doesnt Exist!");
		else if (req.params.username === req.user.username)
			return res.send("Error: Cannot add self!");
		else if (!(teamUser.teamId === null))
			return res.send("Error: User already in a team!");
		// Check if user has registered for presente vous or not
		var competition = await Competition.findOne({});
		console.log(competition);
		var userFound = false;
		competition.users.forEach(function (user) {
			if (String(user) === String(teamUser._id)) {
				userFound = true;
				return;
			}
		});

		if (!userFound)
			return res.send("Error: Member needs to register for Presente vous!");
		// Add user to team list
		await Team.updateOne({ _id: req.user.teamId }, { $addToSet: { teamMembers: teamUser._id } });
		await User.findOneAndUpdate({ _id: teamUser._id }, { $set: { teamId: req.user.teamId } });
		return res.send("User Added!");
	});
});

// Delete complete team, only team leader can delete the team
router.delete("/team/:id", async function (req, res) {
	// logic:
	// Remove teamId from all teamMembers

	var team = await Team.findOne({ _id: req.params.id });
	if(!team)
		return res.send("Error: Team ID Invalid!")
	console.log(team.teamLeader);

	// Check is leader is deleting it 
	//! Not working
	if (team.teamLeader.equals(req.user._id)) {

		// Delete teamID from all users
		await team.teamMembers.forEach(function (member) {
			console.log("Member", member);
			User.updateOne({ _id: member }, { $set: { teamId: null } }, function (err) {
				console.log(err);
			});
		});

		//TODO: Delete Questionnaire if it Exists
		// Delete Questionnaire if it exists

		var ques = Questionnaire.findOneAndRemove({teamId: req.params.id});
		if(ques){
			switch(ques.type){
				case 'bussiness':
					Bussiness.findOneAndRemove({_id: mongoose.Types.ObjectId(ques.q_id)})
					break;
				case 'social':
					Social.findOneAndRemove({_id: mongoose.Types.ObjectId(ques.q_id)})
					break;
				case 'bussiness':
					Operational.findOneAndRemove({_id: mongoose.Types.ObjectId(ques.q_id)})
					break;
			}
		}
		
		// Delete the team
		Team.deleteOne({ _id: req.params.id }, async function (err, deletedTeam) {
			// Delete its executive summary
			await Summary.deleteOne({ teamId: req.params.id })
				.catch((err) => {
					return res.send(err);
				});

			if (err)
				res.send(err);
			else
				res.send("Deleted Team");
		});

	}
	else {
		res.send("Error: only team leader can delete a team!");
	}
});



// Delete user from team
router.post("/team/delete/user", function (req, res) {
	// Delete members from each others table
	if (!req.user.teamId)
		return res.send("Error: User not in a team!");
	Team.findOne({ "_id": req.user.teamId }, async function (err, team) {
		console.log("team: ", team);
		// Check if user is team leader
		if (err)
			return res.send("Error: " + toString(err));

		// Doesnt work in same browser
		if (req.user._id.equals(team.teamLeader)) {
			// Delete the teamId from the user
			console.log(req.user.username, req.user._id, team.teamLeader);
			console.log(mongoose.Schema.Types.ObjectId(req.user._id) === mongoose.Schema.Types.ObjectId(team.teamLeader));
			// res.send("OK");

			await User.findOneAndUpdate({ _id: req.body.teamMember }, { $set: { teamId: null } });
			await Team.findOneAndUpdate({ _id: team._id }, { $pull: { teamMembers: req.body.teamMember } });
			// // Pull the member from the team

			return res.send("Success");
		}
		else {
			return res.send("Error: Only team leader can delete members!");
		}
	});
});

router.put("/team/summary/:type", async function (req, res) {
	if (!req.params.type)
		return res.send("Error: Type Required!");

	if (!req.user.teamId)
		return res.send("Error: User should be in a team!");

	// Check if team exists!
	if (await Questionnaire.findOne({ teamId: req.user.teamId })) {
		return res.send("Error: Already Selected!");
	}

	// Add team to questionnaire
	switch (req.params.type) {
		case 'bussiness':
			var bussiness = await Bussiness.create({
				name: null,
				use: null,
				segmentation: null,
				competition: null,
				financeModel: null,
				feasibility: null,
				breakEvenPoint: null,
				intellectualProperty: null
			});
			Questionnaire.create({ teamId: req.user.teamId, type: req.params.type, q_id: bussiness._id });
			break;
		case 'social':
			var social = await Social.create({
				category: null,
				name: null,
				domain: null,
				socialImpact: null,
				categoryProfit: null,
				marketSegmentation: null,
				financialModel: null,
				competition: null,
				breakEvenPoint: null
			});
			Questionnaire.create({ teamId: req.user.teamId, type: req.params.type, q_id: social._id });
			break;
		case 'operational':
			var operational = Operational.create({
				name: null,
				functionality: null,
				competition: null,
				intellectualProperty: null,
				sellingProp: null,
				domain: null,
				financialPotential: null,
				sustainability: null,
				cost: null,
				capitalization: null
			});
			Questionnaire.create({ teamId: req.user.teamId, type: req.params.type, q_id: operational._id });
			break;
	}

	console.log(req.params.type);
	return res.send(req.params.type);
})

router.put("/team/questionnaire/save/:type", async function (req, res) {
	if (req.params.type === 'business') {
		var data = {
			name: req.body.name,
			use: req.body.use,
			segmentation: req.body.segmentation,
			competition: req.body.competition,
			financeModel: req.body.financeModel,
			feasibility: req.body.feasibility,
			breakEvenPoint: req.body.breakEvenPoint,
			intellectualProperty: req.body.intellectualProperty,
		}
	}
	else if (req.params.type === 'social') { }
	else if (req.params.type === 'operational') {
		var data = {
			name: req.body.name,
			functionality: req.body.functionality,
			competition: req.body.competition,
			intellectualProperty: req.body.intellectualProperty,
			sellingProp: req.body.sellingProp,
			domain: req.body.domain,
			financialPotential: req.body.financialPotential,
			sustainability: req.body.sustainability,
			cost: req.body.cost,
			capitalization:req.body.capitalization
		}
	} else{
		return res.send("Error: Invalid type!");
	}
	if (!req.user.teamId)
		return res.send("Error: User needs to be in a team!");

	// Create questionnarire if not exists
	Questionnaire.findOne({ teamId: mongoose.Types.ObjectId(req.user.teamId) }, async function (err, q) {
		if (!q.q_id) {
			if (q.type === 'bussiness')
				var ques = await Bussiness.create(data);
			else if(q.type==='social')
				var ques = await Social.create(data);
			else if(q.type==='operational')
				var ques = Operational.create(data);
			else
				return res.send("Error: Invalid Type!");
			// Add questionaare id to main document
			await Questionnaire.findOneAndUpdate({ teamId: req.user.teamId }, { $set: { q_id: ques._id } })
		}
		else {
			await Questionnaire.findOneAndUpdate(q._id, { $set: data });
			return res.send("Success!");
		}
	})



});

//! Depricated
// Update User Summary
router.put("/team/summary", function (req, res) {
	// Check important fields
	if ((req.body.teamId == '') || (req.body.startupName == '') || (req.body.startupType == '')) {
		return res.send("Error: Empty Fields not allowed!");
	}

	// Check team status
	if (!req.body.teamId)
		return res.send("Error: Need to be in a team!");

	var details = {
		teamId: req.body.teamId,
		startupName: req.body.startupName,
		startupType: req.body.startupType,
		isSubmitted: false,
		executiveSummary: req.body.executiveSummary
	};

	// Find and update summary, if summary doesnt exist, it will be made automatically
	Summary.findOne({
		teamId: req.body.teamId
	}, async function (err, summary) {
		if (err)
			return res.send("Error: " + err);
		// create a new sumary
		if (summary === null)
			await Summary.create(details)
				.catch(err => {
					return res.send("Error: " + err);
				});
		else if (summary.isSubmitted)
			return res.send("Error: Cannot update a submitted summary! Contact Admin!");
		// update existing summary
		else
			await Summary.findOneAndUpdate({
				teamId: req.user.teamId
			}, {
					$set: details
				});
	});
	res.send("OK");
	// Check if the startUp type is in the given options
});

module.exports = router;