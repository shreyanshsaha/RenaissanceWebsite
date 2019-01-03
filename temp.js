var express = require("express");
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyparser = require('body-parser');
var multer = require('multer');
var middleware = require("./middleware");
//var upload = multer({ dest: 'public/images' })
const multerConf = {
	storage: multer.diskStorage({
		destination: function (req, file, next) {
			next(null, 'public/images');
		},
		filename: function (req, file, next) {
			const ext = file.mimetype.split('/')[1];
			next(null, file.fieldname + '-' + Date.now() + '.' + ext);
		}
	}),
	filefilter: function (req, file, next) {
		if (!file) {
			next();
		}
		const image = file.mimetype.startsWith('image/');
		if (image) {
			next(null, true);
		} else {
			next({
				message: "File type not supported"
			}, false);
		}
	}

};
// ========
// Database
// ========
var User = require("./models/userModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
var Team = require("./models/teamModel");
var middleware = require("./middleware");
var Temp = require("./models/tempModel");

//var app = express()
router.get("/internship", async function (req, res) {
	var test = await Temp.find();
	return res.render("internship", {
		test: test
	});
});
router.get("/add_internship", middleware.isAdmin, async function (req, res) {

	return res.render("add_internship");
});

router.get("/edit", middleware.isAdmin, async function (req, res) {
	var test = await Temp.find();
	return res.render("edit_internship", {
		test: test
	});
});

router.post("/edit/:id", middleware.isAdmin, multer(multerConf).single('myimage'), async function (req, res) {

	if (req.file) {
		req.body.myimage = req.file.destination.slice(6) + '/' + req.file.filename;
		Temp.updateOne({
			_id: req.params.id
		}, {
			$set: {
				role: req.body.role,
				imageUrl: req.body.myimage,
				company: req.body.company,
				location: req.body.location,
				cost: req.body.cost,
				duration: req.body.duration,
				description: req.body.description
			}
		}, function (err, deledata) {
			res.redirect("/edit");
		});
	} else {
		Temp.updateOne({
			_id: req.params.id
		}, {
			$set: {
				role: req.body.role,
				company: req.body.company,
				location: req.body.location,
				cost: req.body.cost,
				duration: req.body.duration,
				description: req.body.description
			}
		}, function (err, deledata) {
			res.redirect("/edit");
		});

	}

});

//add internship

router.post("/add_internship/new", middleware.isAdmin, multer(multerConf).single('myimage1'), async function (req, res) {

	if (req.file) {
		req.body.myimage = req.file.destination.slice(6) + '/' + req.file.filename;
		new Temp({
			role: req.body.role,
			imageUrl: req.body.myimage,
			company: req.body.company,
			location: req.body.location,
			cost: req.body.cost,
			duration: req.body.duration,
			description: req.body.description
		}).save(function (err, doc) {
			if (err) return res.json(err);
			else
				return res.redirect("/internship");
		});
	} else {
		new Temp({
			role: req.body.role,
			imageUrl: req.body.myimage,
			company: req.body.company,
			location: req.body.location,
			cost: req.body.cost,
			duration: req.body.duration,
			description: req.body.description
		}).save(function (err, doc) {
			if (err) return res.json(err);
			else
				return res.redirect("/internship");
		});
	}
});

module.exports = router;
