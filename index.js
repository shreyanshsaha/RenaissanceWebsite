var express = require('express'),
		seedDB = require('./seed');
		bodyParser=require('body-parser'),
		User = require('./models/userModel'),
		mongoose = require('mongoose');
	
var app = express();

mongoose.connect("mongodb://localhost/renaissance");
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

seedDB();

// ======
// Routes
// ======
app.get("/", function(req, res){
	res.render("home");
});

app.get("/register", function(req, res){
	res.render("register", {messages: undefined});
});

app.post("/register", function(req, res){
	console.log(req.body);
  var user={
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		email: req.body.email,
		registrationNo: req.body.registrationNo
	};
	User.create(user, function(err, newUser){
		if(err)
			console.log(err);
		else{
			console.log("[+] User Added:", newUser);
		}
	});
});

app.get("/getAllStudent", function(req, res){
	User.find({}, function(err, users){
		if(err)
			console.log(err);
		else
			res.send(users);
	})
});

app.listen(80, function(){
	console.log("Server has started!");
})
// app.listen(process.env.PORT, process.env.IP);