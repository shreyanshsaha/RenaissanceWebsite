
var express 			= require('express'),
		seedDB 				= require('./seed'),
		bodyParser		= require('body-parser'),
		User 					= require('./models/userModel'),
		mongoose 			= require('mongoose'),
		passport 			= require('passport'),
		LocalStrategy = require('passport-local');

var app = express();
// mongodb://heroku_np15kmnp:8560fls5thno6kh6di7hleddbg@ds263642.mlab.com:63642/heroku_np15kmnp
mongoose.connect("mongodb://localhost/renaissance");
app.set("view engine", "ejs");
// app.use(express.static(__dirname + "/public"));

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }))

// PASSPORT CONFIGURATION
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
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	next();
});

function isLoggedIn(req, res, next){
	if(req.isAuthenticated()){
			return next();
	}
	console.log(req.user, " not logged in!");
	res.redirect("/login");
}

// Seed the database
seedDB();

// ======
// Routes
// ======

// Root
app.get("/", function(req, res){
	res.render("home");
});

// Register
app.get("/register", function(req, res){
	res.render("reg_page", {messages: undefined});
});

app.post("/register", function(req, res){
	User.register(new User({
		firstName: req.body.firstName,
		lastName: req.body.lastName, 
		email: req.body.email, 
		username: req.body.username}), req.body.password, function(err, newUser){
		if(err){
			console.log(err);
			res.send(err);
		}
		else{
			console.log("[+] User Registered:", newUser);
			passport.authenticate("local")(req, res, function(){
				res.redirect("/");
			});
		}
	});
});


// Login and Logout
app.get("/login", function(req, res){
	res.render("login");
});

app.post("/login",passport.authenticate("local",
	{
		successRedirect: "/",
		failureRedirect: "/register",
	}), function(req, res){}
);

app.get("/logout", isLoggedIn, function(req, res){
	console.log("Logout: ", req.currentUser.username);
	req.logout();
	// res.send("Logged Out!");
	res.redirect("/");
});

app.get("/profile", isLoggedIn, function(req, res){
	res.send("User logged in!"+JSON.stringify(req.user));
})


//! Debug Routes Remove them in release
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
