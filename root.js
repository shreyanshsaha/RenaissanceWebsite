
var express = require("express");
var router = express.Router();
// ===========
// Root Routes
// ===========

// Root
router.get("/", function (req, res) {
	Event.find({}, function(err, events){
		if(err)
			console.log(err);
		else
			res.render("home", { events: events });
	});
});

// Past Sponsors
router.get("/sponsors", function(req, res){
	res.render("sponsors", {sponsors: sponsorDetails});
});




module.exports = router;