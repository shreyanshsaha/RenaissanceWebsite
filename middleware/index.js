

var middlewareObj = {};

middlewareObj.isLoggedIn=function(req, res, next) {
    console.log("User Checking")
    if (req.isAuthenticated()) {
      if(req.user.isAdmin===true){
        console.log("Logged In user is ADMIN!");
        return res.redirect("/admin");
      }
      else
        return next();
    }
    console.log(req.user, " not logged in!");
    // return res.redirect("/login/?ref=" + req.originalUrl);
    return res.redirect("/login");
}

middlewareObj.isStockAdmin=function(req, res, next){
  if(req.isAuthenticated())
    if(req.user.username == 'admin.stock')
      return next();
  return res.redirect("/login");
}

middlewareObj.isNotLoggedIn=function(req, res, next){
	if(!req.isAuthenticated())
		return next();
	else
		return res.redirect("/");
}

middlewareObj.isAdmin=function(req, res, next) {
	if (req.isAuthenticated() && req.user.isAdmin === true)
		return next();
	res.redirect("/login");
}



module.exports = middlewareObj;