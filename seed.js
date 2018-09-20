var mongoose = require('mongoose');
var User = require("./models/userModel");
var Company = require("./models/companyModel");

var studentData =[
  {firstName:"A1", lastName:"B1",email:"a1@b.com", registrationNo:'123'},
  {firstName:"A2", lastName:"B2",email:"a2@b.com", registrationNo:'122'},
  {firstName:"A3", lastName:"B3",email:"a3@b.com", registrationNo:'121'},
]
function seedDB(){
  User.remove({}, function(err){
    if(err)
      console.log(err);
    studentData.forEach(function(student){
      User.create(student, function(err, stu){
        if(err){
          console.log("Error", err);
          console.log(student);
        }
        else
          console.log("Student added to database!");  
      })
    })
  })
}

module.exports = seedDB;