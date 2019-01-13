var express = require("express");
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local');
var bodyparser = require('body-parser');
var async = require("async");
var nodemailer = require("nodemailer");
var crypto = require("crypto");

 
var middleware = require("./middleware");
var User = require("./models/userModel");
var Summary = require("./models/presenteSummary");
var Event = require("./models/eventModel");
var Team = require("./models/teamModel");
var middleware = require("./middleware");
var Temp = require("./models/tempModel");
router.get("/forgot1", async function (req, res) {	
	res.send(req.flash('error'));
});
router.get("/forgot", async function (req, res) {	
	return res.render("forget");
});
router.post('/forgot', function(req, res, next) {
    async.waterfall([
      function(done) {
        crypto.randomBytes(20, function(err, buf) {
          var token = buf.toString('hex');
          done(err, token);
        });
      },
      function(token, done) {
        User.findOne({ email: req.body.email }, function(err, user) {
          if (!user) {
              console.log('email not found');
           req.flash('error','No account with that email address exists.');
           //res.send(req.flash('error'));
            return res.redirect('/forgot');
          }
  
          user.resetPasswordToken = token;
          user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  
          user.save(function(err) {
            done(err, token, user);
          });
        });
      },
      function(token, user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            secure:false,
            port:3000,
            auth: {
               user: 'tech.renaissance18@gmail.com',
              pass: 'vit_cc_tech.'
            },
            tls:{
                rejectUnauthorised:false
            }
          });
          
          
          
         var mailOptions = {
          to: user.email,
          from: 'studentvit0@gmail.com',
          subject: ' Password Reset',
          text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
            'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
            'http://' + req.headers.host + '/reset/' + token + '\n\n' +
            'If you did not request this, please ignore this email and your password will remain unchanged.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
          console.log('mail sent');
        req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
          done(err, 'done');
         // return res.send("Success");
        });
      }
    ], function(err) {
      if (err) return res.err;
      return res.redirect('/forgot');
    });
  });
  //reset
  router.get('/reset/:token', function(req, res) {
    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
      if (!user) {
        req.flash('error', 'Password reset token is invalid or has expired.');
        return res.redirect('/forgot');
      }
      res.render('reset', {token: req.params.token});
    });
  });
  
  router.post('/reset/:token', function(req, res) {
    async.waterfall([
      function(done) {
        User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
          if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('back');
          }
          if(req.body.password === req.body.confirm) {
            user.setPassword(req.body.password, function(err) {
              user.resetPasswordToken = undefined;
              user.resetPasswordExpires = undefined;
  
              user.save(function(err) {
                req.logIn(user, function(err) {
                  done(err, user);
                });
              });
            })
          } else {
              req.flash("error", "Passwords do not match.");
              return res.redirect('back');
          }
        });
      },
      function(user, done) {
        var smtpTransport = nodemailer.createTransport({
            service: 'gmail',
            secure:false,
            port:3000,
            auth: {
               user: 'tech.renaissance18@gmail.com',
              pass: 'vit_cc_tech.'
            },
            tls:{
                rejectUnauthorised:false
            }
        });
        var mailOptions = {
          to: user.email,
          from: 'tech.renaissance18@gmail.com',
          subject: 'Your password has been changed',
          text: 'Hello,\n\n' +
            'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
        };
        smtpTransport.sendMail(mailOptions, function(err) {
         req.flash('success', 'Success! Your password has been changed.');
          done(err);
        });
      }
    ], function(err) {
     return  res.redirect('/');
    });
  }); 

module.exports = router;
