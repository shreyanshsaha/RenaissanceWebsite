var express = require('express');

var app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", function(req, res){
  res.render("home");
});


app.listen(process.env.PORT, process.env.IP);