var express = require("express");
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyparser=require('body-parser');
var multer  = require('multer')
//var upload = multer({ dest: 'public/images' })
const multerConf={
storage:multer.diskStorage({
	destination:function(req,file,next){
		next(null,'public/images');
	},
	filename:function(req,file,next){
		const ext =file.mimetype.split('/')[1];
		next(null,file.fieldname+'-'+Date.now()+'.'+ext);
	}
}),
filefilter:function(req,file,next){
	if(!file){
		next();
	}
	const image=file.mimetype.startsWith('image/');
	if(image){
		next(null,true);
	}else{
		next({message:"File type not supported"},false);
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
router.get("/temp",  async function (req, res) {
	var test= await Temp.find();
	return res.render("view_post",{test:test});
});

router.get("/edit",  async function (req, res) {
	var test= await Temp.find();
	return res.render("edit_post",{test:test});
});

router.post("/edit/change/:id", multer(multerConf).single('myimage'), async function (req, res) {

	if(req.file)
	{
		req.body.myimage=req.file.destination.slice(6)+'/'+req.file.filename;
	 Temp.updateOne({_id:req.params.id}, {$set: {heading:req.body.heading,imageUrl:req.body.myimage,
		description:req.body.description}},function (err, deledata) {
		res.redirect("/edit");
	});
	}
else
{
	Temp.updateOne({_id:req.params.id}, {$set: {heading:req.body.heading,
		description:req.body.description}},function (err, deledata) {
		res.redirect("/edit");
	});

}

});
module.exports = router;
